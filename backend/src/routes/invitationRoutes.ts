import express from 'express';
import generateInvitationCode from '../helpers/invitationHelper';

const router = express.Router();

router.post('/generate-invitation-code', async (req, res) => {
  try {
    const newCode = await generateInvitationCode();
    res.status(200).json({ code: newCode });
  } catch {
    res.status(500).json({ error: 'Error generating invitation code' });
  }
});

export default router;
