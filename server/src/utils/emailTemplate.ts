export const generateInvitationEmail = ({ inviterName, boardName, inviteLink } : {inviterName:string,boardName:string,inviteLink:string}) => {
    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9fb; padding: 30px; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background-color: #4F46E5; padding: 20px; color: white; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎨 SketchSpace Invitation</h1>
          <p style="margin: 8px 0 0; font-size: 16px;">Collaborate and create in real time</p>
        </div>
  
        <div style="padding: 30px;">
          <p style="font-size: 18px;">Hi there,</p>
          <p style="font-size: 16px; line-height: 1.6;">
            <strong>${inviterName}</strong> has invited you to join a whiteboard session on <strong>SketchSpace</strong> for the board <strong>"${boardName}"</strong>.
          </p>
  
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #4F46E5; color: white; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
              Join Whiteboard
            </a>
          </div>
  
          <p style="font-size: 14px; color: #555;">
            If the button above doesn't work, you can copy and paste the link below into your browser:
          </p>
          <p style="word-break: break-all; font-size: 14px; color: #4F46E5;">
            <a href="${inviteLink}" style="color: #4F46E5;">${inviteLink}</a>
          </p>
  
          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">
            Made with ❤️ by the SketchSpace Team
          </p>
        </div>
      </div>
    </div>
    `;
  };
  