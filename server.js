const express = require('express');
const mongoose = require('mongoose');
const expressFileUpload = require('express-fileupload');
const exceljs = require('exceljs');
const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const pdf = require('html-pdf');
const TreeDonation = require('./models/treeDonation');

const app = express();
const port = 3000;

// Define certificatesDirectory
const certificatesDirectory = path.join(__dirname, 'certificates');

mongoose.connect('mongodb+srv://Harman:Harman@cluster0.7zlcmek.mongodb.net/greencertify', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(expressFileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit', async (req, res) => {
  try {
    const excelFile = req.files.excelFile;
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.load(excelFile.data);
    const sheet = workbook.getWorksheet(1);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'harmanjot0555.be21@chitkara.edu.in',
        pass: 'Kainth@1212@',
      },
    });

    sheet.eachRow(async (row, rowNumber) => {
      if (rowNumber > 1) {
        const [empty, name, emailObj, phoneNumberObj, amount] = row.values;
        const email = emailObj.text;
        const phoneNumber = phoneNumberObj.text;
        const treesDonated = Math.floor(amount / 100);

        // Create a new TreeDonation without explicitly setting certificateId
        const treeDonation = await TreeDonation.create({
          name,
          email,
          phoneNumber,
          amount,
          treesDonated,
        });

        // Render the certificate template with parameters including certificateId
        const certificateHTML = await ejs.renderFile(
          path.join(__dirname, 'views', 'certificate.ejs'),
          {
            name,
            amount,
            treesDonated,
            certificateId: treeDonation.certificateId,
          }
        );

        // Generate PDF certificate
        const pdfFilePath = path.join(
          certificatesDirectory,
          `${name}_certificate.pdf`
        );

        // Use html-pdf to generate PDF from HTML
        pdf.create(certificateHTML).toFile(pdfFilePath, function (err, res) {
          if (err) return console.log(err);

          // Send email with the PDF certificate attached
          const mailOptions = {
            from: 'harmanjot0555.be21@chitkara.edu.in',
            to: email,
            subject: 'Congratulations on Your Tree Donation!',
            text: 'Thank you for your generous donation.',
            attachments: [
              {
                filename: 'certificate.pdf',
                path: pdfFilePath,
                encoding: 'base64',
              },
            ],
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        });
      }
    });

    res.send('Data imported successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error importing data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
