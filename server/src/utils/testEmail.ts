import sendEmail from "./sendEmail.js";

export const testSend = async () => {
  await sendEmail({
    to: "sohampathak1211@gmail.com",
    subject: "Welcome to SketchSpace!",
    html: `<p>Hey there 👋,<br> Thanks for signing up!</p>`,
  });
};
