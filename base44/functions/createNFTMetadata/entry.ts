import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const PINATA_API_KEY = Deno.env.get("PINATA_API_KEY");
const PINATA_SECRET_KEY = Deno.env.get("PINATA_SECRET_KEY");
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, imageHash, attributes } = await req.json();

    if (!name || !description || !imageHash) {
      return Response.json({ 
        error: 'Name, description, and imageHash are required' 
      }, { status: 400 });
    }

    // Create NFT metadata
    const metadata = {
      name,
      description,
      image: `ipfs://${imageHash}`,
      attributes: (attributes || []).map(attr => ({
        trait_type: attr.trait,
        value: attr.value
      })),
      external_url: `https://qvtx.io/nft/${name.toLowerCase().replace(/\s+/g, '-')}`,
      created_by: user.email,
      created_at: new Date().toISOString()
    };

    // Upload metadata to IPFS
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { 
      type: 'application/json' 
    });

    const formData = new FormData();
    formData.append('file', blob, `${name.replace(/\s+/g, '-')}-metadata.json`);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINATA_API_KEY}`,
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pinata upload failed: ${error}`);
    }

    const data = await response.json();

    return Response.json({
      success: true,
      metadata,
      metadataHash: data.IpfsHash,
      metadataUrl: `${PINATA_GATEWAY}${data.IpfsHash}`,
      metadataUri: `ipfs://${data.IpfsHash}`
    });

  } catch (error) {
    console.error('NFT metadata creation error:', error);
    return Response.json({ 
      error: error.message || 'Failed to create NFT metadata' 
    }, { status: 500 });
  }
});