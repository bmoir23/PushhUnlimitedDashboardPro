// Utility to check if required secrets are available

export async function check_secrets() {
  const requiredSecrets = [
    { key: "VITE_AUTH0_DOMAIN", name: "Auth0 Domain" },
    { key: "VITE_AUTH0_CLIENT_ID", name: "Auth0 Client ID" },
  ];

  const missingSecrets = requiredSecrets.filter(
    (secret) => !import.meta.env[secret.key]
  );

  if (missingSecrets.length > 0) {
    console.warn(
      `Missing required secrets: ${missingSecrets
        .map((s) => s.name)
        .join(", ")}`
    );
    return false;
  }

  return true;
}