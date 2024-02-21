// Importing dependencies
const {DefaultAzureCredential} = require('@azure/identity');
const {SecretClient} = require('@azure/keyvault-secrets');
const app = require('express')();

// Initialize port
const port = process.env.PORT || 3000;

// Create Vault URI from App Settings
const vaultUri = `https://${process.env.VaultName}.vault.azure.net/`;

// Map of key vault secret names to values
let vaultSecretsMap = {};

const getKeyVaultSecrets = async () => {
  // Create a key vault secret client
  let secretClient = new SecretClient(vaultUri, new DefaultAzureCredential());
  try {
    // Iterate through each secret in the vault
    listPropertiesOfSecrets = secretClient.listPropertiesOfSecrets();
    while (true) {
      let {done, value} = await listPropertiesOfSecrets.next();
      if (done) {
        break;
      }
      // Only load enabled secrets - getSecret will return an error for disabled secrets
      if (value.enabled) {
        const secret = await secretClient.getSecret(value.name);
        vaultSecretsMap[value.name] = secret.value;
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};

app.get('/api/SecretTest', (req, res) => {
  let secretName = 'SecretPassword';
  let response;
  if (secretName in vaultSecretsMap) {
    response = `Secret value: ${vaultSecretsMap[secretName]}\n\nThis is for testing only! Never output a secret to a response or anywhere else in a real app!`;
  } else {
    response = `Error: No secret named ${secretName} was found...`;
  }
  res.type('text');
  res.send(response);
});

(async () => {
  await getKeyVaultSecrets();
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
})().catch(err => console.log(err));

// Assigned to the webapp we created
// {
//     "principalId": "d29c0b31-2ba6-4531-a146-0a7f7da3f686",
//     "tenantId": "604c1504-c6a3-4080-81aa-b33091104187",
//     "type": "SystemAssigned",
//     "userAssignedIdentities": null
//   }
