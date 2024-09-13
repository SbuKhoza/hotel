const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./path/to/your/serviceAccountKey.json'); // replace with your service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

const createAdminUser = async (email, password) => {
  try {
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      emailVerified: false,
      disabled: false,
    });

    console.log('Successfully created new user:', userRecord.uid);
  } catch (error) {
    console.error('Error creating new user:', error);
  }
};

// Call the function with your desired email and password
createAdminUser('sbudam@gmail.com', 'P@ssword1');
