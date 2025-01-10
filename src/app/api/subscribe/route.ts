// POST handler - /api/subscribe/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import ConfirmationEmail from "@/emails/ConfirmationEmail";
import { encrypt } from "@/lib/crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Add user to Resend audience as unsubscribed
    const contact = await resend.contacts.create({
      email,
      unsubscribed: true,
      audienceId: process.env.RESEND_AUDIENCE_ID as string,
    });

    if (!contact.data) {
      throw new Error("Failed to create contact");
    }

    // Generate a token with encrypted email, contactId, and timestamp
    const tokenData = `${email}:${contact.data.id}:${Date.now()}`;
    const token = encrypt(tokenData);

    const confirmationLink = `${process.env.NEXT_PUBLIC_APP_URL}/confirm?token=${encodeURIComponent(token)}`;

    // Send confirmation email
    await resend.emails.send({
      from: "zeh@zeh.tools",
      to: email,
      subject: "Confirm your subscription",
      react: ConfirmationEmail({ confirmationLink }),
    });

    return NextResponse.json({ message: "Confirmation email sent" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error processing subscription" },
      { status: 500 }
    );
  }
}
