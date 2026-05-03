import nodemailer from 'nodemailer';

async function createEtherealAccount() {
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('\n📧 ETHEREAL TEST ACCOUNT CREATED!');
    console.log('================================');
    console.log('SMTP Host:', testAccount.smtp.host);
    console.log('SMTP Port:', testAccount.smtp.port);
    console.log('Email User:', testAccount.user);
    console.log('Email Pass:', testAccount.pass);
    console.log('================================');
    console.log('\nAdd these to your .env file:\n');
    console.log(`EMAIL_HOST=${testAccount.smtp.host}`);
    console.log(`EMAIL_PORT=${testAccount.smtp.port}`);
    console.log(`EMAIL_USER=${testAccount.user}`);
    console.log(`EMAIL_PASS=${testAccount.pass}`);
    console.log('\nThen run: node index.js\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

createEtherealAccount();