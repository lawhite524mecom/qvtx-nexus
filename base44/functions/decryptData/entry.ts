import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { encrypted, iv, salt, password } = await req.json();

    if (!encrypted || !iv || !salt || !password) {
      return Response.json({ 
        error: 'Encrypted data, iv, salt, and password are required' 
      }, { status: 400 });
    }

    // Convert from base64
    const encryptedArray = new Uint8Array(
      atob(encrypted).split('').map(c => c.charCodeAt(0))
    );
    const ivArray = new Uint8Array(
      atob(iv).split('').map(c => c.charCodeAt(0))
    );
    const saltArray = new Uint8Array(
      atob(salt).split('').map(c => c.charCodeAt(0))
    );

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Derive key from password
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltArray,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // Decrypt data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivArray
      },
      key,
      encryptedArray
    );

    const decryptedText = decoder.decode(decryptedData);
    const data = JSON.parse(decryptedText);

    return Response.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Decryption error:', error);
    return Response.json({ 
      error: 'Failed to decrypt data - invalid password or corrupted data' 
    }, { status: 500 });
  }
});