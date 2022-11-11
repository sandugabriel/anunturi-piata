import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req, res) {
  const values = req.body;
  let datesString = '';
  console.log(values.dates)
  values.dates.forEach((date) => {
    datesString = datesString + date.toString() + ' ';
  })
  try {
    // console.log("REQ.BODY", req.body);
    await sendgrid.send({
      to: 'sandugabriel97@gmail.com', // Your email where you'll receive emails
      from: "sandugabriel97@gmail.com", // your website email address here
      subject: 'Anunt nou!',
      html: `
      <h1>Anunt nou</h1>
      <p>Nume: ${values.name}</p>
      <p>Email: ${values.email}</p>
      <p>Text anunt: ${values.anunt}</p>
      <p>Publicatie: ${values.publication}</p>
      <p>Tipul anuntului: ${values.type}</p>
      <p>Datele de aparitie: ${datesString}</p>
      <p>Pretul propus: ${values.price}</p>
      `,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ error: "" });
}

export default sendEmail;