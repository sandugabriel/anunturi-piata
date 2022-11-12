import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req, res) {
  const values = req.body;
  console.log(values)
  let datesString = "";
  console.log(values.dates);
  values.dates.forEach((date) => {
    datesString = datesString + date.toString() + " ";
  });
  const today = values.today.toString();
  const tomorrow = values.tomorrow.toString();
  const id = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  try {
    await sendgrid.send({
      to: "piataseverineana@gmail.com", // Your email where you'll receive emails
      from: "sandugabriel97@gmail.com", // your website email address here
      subject: "Anunt nou!",
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
    // console.log(error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  try {
    await sendgrid.send({
      to: values.email, // Your email where you'll receive emails
      from: "sandugabriel97@gmail.com", // your website email address here
      subject: "Anunt Piata Severineana",
      templateId: "d-6b8e572ecb3a4287a810278403cfd848",
      dynamic_template_data: {
        "id": id,
        "today": today,
        "tomorrow": tomorrow,
        "companyName": values.companyName,
        "name": values.name,
        "email": values.email,
        "product": `${values.type} ${values.publication}`,
        "price": values.price
      }
    });
  } catch (error) {
    // console.log(error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ error: "" });
}

export default sendEmail;
