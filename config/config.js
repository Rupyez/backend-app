const port = process.env.PORT;
const service = process.env.SMTP_SERVICE;
const mail = process.env.SMTP_MAIL;
const password = process.env.SMTP_PASSWORD;
const host = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const envirnoment = process.env.ENVIRONMENT || "development";
let baseUrl = " ";
if (envirnoment === "development") {
  baseUrl = `http://localhost:${port}`;
} else if (envirnoment === "test") {
  baseUrl = `https://learning-management-system-kx6y.onrender.com`;
} else if (envirnoment === "production") {
  baseUrl = ``;
}

module.exports = {
  port,
  service,
  mail,
  password,
  host,
  smtpPort,
  baseUrl,
};
