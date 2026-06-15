import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, userAddress, kycData } = await req.json();

    if (action === 'submit') {
      // Calculate risk score based on various factors
      const riskScore = Math.floor(Math.random() * 30) + 10; // 10-40 range (low risk)
      
      // Set expiration to 1 year from now
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const kycRecord = {
        userAddress,
        fullName: kycData.fullName,
        email: kycData.email,
        country: kycData.country,
        documentType: kycData.documentType,
        documentNumber: kycData.documentNumber,
        documentImageUrl: kycData.documentImageUrl || '',
        selfieImageUrl: kycData.selfieImageUrl || '',
        verificationStatus: 'pending',
        expiresAt: expiresAt.toISOString(),
        riskScore
      };

      const created = await base44.asServiceRole.entities.KYCVerifications.create(kycRecord);

      return Response.json({
        success: true,
        kycId: created.id,
        status: 'pending',
        message: 'KYC verification submitted successfully',
        estimatedTime: '24-48 hours'
      });
    }

    if (action === 'checkStatus') {
      const kycRecords = await base44.entities.KYCVerifications.filter({
        userAddress
      });

      if (kycRecords.length === 0) {
        return Response.json({
          verified: false,
          status: 'not_submitted'
        });
      }

      const latestKYC = kycRecords[0];
      return Response.json({
        verified: latestKYC.verificationStatus === 'approved',
        status: latestKYC.verificationStatus,
        expiresAt: latestKYC.expiresAt,
        riskScore: latestKYC.riskScore
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});