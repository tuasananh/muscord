import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import E from '../types/Env';

function getSubtleCrypto(): SubtleCrypto {
	// @ts-ignore
	if (typeof window !== 'undefined' && window.crypto) {
		// @ts-ignore
		return window.crypto.subtle;
	}
	if (
		typeof globalThis !== 'undefined' &&
		// @ts-ignore
		globalThis.crypto
	) {
		// @ts-ignore
		return globalThis.crypto.subtle;
	}
	if (typeof crypto !== 'undefined') {
		return crypto.subtle;
	}
	if (typeof require === 'function') {
		// Cloudflare Workers are doing what appears to be a regex check to look and
		// warn for this pattern. We should never get here in a Cloudflare Worker, so
		// I am being coy to avoid detection and a warning.
		const cryptoPackage = 'node:crypto';
		const crypto = require(cryptoPackage);
		return crypto.webcrypto.subtle;
	}
	throw new Error('No Web Crypto API implementation found');
}

export const subtleCrypto = getSubtleCrypto();

/**
 * Converts different types to Uint8Array.
 *
 * @param value - Value to convert. Strings are parsed as hex.
 * @param format - Format of value. Valid options: 'hex'. Defaults to utf-8.
 * @returns Value in Uint8Array form.
 */
export function valueToUint8Array(
	value: Uint8Array | ArrayBuffer | Buffer | string,
	format?: string
): Uint8Array {
	if (value == null) {
		return new Uint8Array();
	}
	if (typeof value === 'string') {
		if (format === 'hex') {
			const matches = value.match(/.{1,2}/g);
			if (matches == null) {
				throw new Error('Value is not a valid hex string');
			}
			const hexVal = matches.map((byte: string) =>
				Number.parseInt(byte, 16)
			);
			return new Uint8Array(hexVal);
		}

		return new TextEncoder().encode(value);
	}
	try {
		if (Buffer.isBuffer(value)) {
			return new Uint8Array(value);
		}
	} catch (ex) {
		// Runtime doesn't have Buffer
	}
	if (value instanceof ArrayBuffer) {
		return new Uint8Array(value);
	}
	if (value instanceof Uint8Array) {
		return value;
	}
	throw new Error(
		'Unrecognized value type, must be one of: string, Buffer, ArrayBuffer, Uint8Array'
	);
}

/**
 * Merge two arrays.
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Concatenated arrays
 */
export function concatUint8Arrays(
	arr1: Uint8Array,
	arr2: Uint8Array
): Uint8Array {
	const merged = new Uint8Array(arr1.length + arr2.length);
	merged.set(arr1);
	merged.set(arr2, arr1.length);
	return merged;
}
export async function verifyKey(
	rawBody: Uint8Array | ArrayBuffer | Buffer | string,
	signature: string,
	timestamp: string,
	clientPublicKey: string | CryptoKey
): Promise<boolean> {
	try {
		const timestampData = valueToUint8Array(timestamp);
		const bodyData = valueToUint8Array(rawBody);
		const message = concatUint8Arrays(
			timestampData,
			bodyData
		);
		const publicKey =
			typeof clientPublicKey === 'string'
				? await subtleCrypto.importKey(
						'raw',
						valueToUint8Array(clientPublicKey, 'hex'),
						{
							name: 'ed25519',
							namedCurve: 'ed25519',
						},
						false,
						['verify']
				  )
				: clientPublicKey;
		const isValid = await subtleCrypto.verify(
			{
				name: 'ed25519',
			},
			publicKey,
			valueToUint8Array(signature, 'hex'),
			message
		);
		return isValid;
	} catch (ex) {
		return false;
	}
}
const verifyDiscordRequest = createMiddleware<E>(
	async (c, next) => {
		const signature = c.req.header('x-signature-ed25519');
		const timestamp = c.req.header('x-signature-timestamp');
		const body = await c.req.text();
		const isValidRequest =
			signature &&
			timestamp &&
			(await verifyKey(
				body,
				signature,
				timestamp,
				c.env.DISCORD_PUBLIC_KEY
			));
		if (!isValidRequest) {
			throw new HTTPException(401, {
				message: 'Bad request signature.',
			});
		}
		await next();
	}
);

export default verifyDiscordRequest;
