import {
  Button,
  Html,
  Text,
  Section,
  Container,
} from "@react-email/components";

export default function ConfirmationEmail({
  confirmationLink,
}: {
  confirmationLink: string;
}) {
  return (
    <Html>
      <Section style={{ backgroundColor: "#f6f9fc" }}>
        <Container style={{ padding: "20px", backgroundColor: "#ffffff" }}>
          <Text>
            Thank you for subscribing! Please confirm your email address to
            complete your subscription.
          </Text>
          <Text>This confirmation link will expire in 24 hours.</Text>
          <Button
            href={confirmationLink}
            style={{
              backgroundColor: "#3498db",
              color: "#ffffff",
              padding: "12px 20px",
            }}
          >
            Confirm Subscription
          </Button>
        </Container>
      </Section>
    </Html>
  );
}
