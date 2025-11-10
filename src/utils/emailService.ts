// Email service for sending appointment confirmations
// Using Gmail SMTP for sending confirmation emails
      <body>
        <div class="container">
          <div class="header">
            <h1>🐾 PawMilya Veterinary Clinic</h1>
            <h2>Appointment Confirmation</h2>
          </div>
          
          <div class="content">
            <p>Dear <span class="highlight">${data.ownerName}</span>,</p>
            
            <p>Thank you for booking an appointment with PawMilya Veterinary Clinic. Your appointment has been successfully scheduled!</p>
            
            <div class="appointment-details">
              <h3>📅 Appointment Details</h3>
              <div class="info-row">
                <span class="label">Pet Name:</span> ${data.petName}
              </div>
              <div class="info-row">
                <span class="label">Pet Species:</span> ${formatPetSpecies(data.petSpecies)}
              </div>
              <div class="info-row">
                <span class="label">Service:</span> ${serviceDisplayName}
              </div>
              <div class="info-row">
                <span class="label">Date:</span> ${formattedDate}
              </div>
              <div class="info-row">
                <span class="label">Time:</span> ${data.timeSlot}
              </div>
              ${data.additionalInfo ? `
              <div class="info-row">
                <span class="label">Additional Information:</span> ${data.additionalInfo}
              </div>
              ` : ''}
              ${data.bloodTest && data.bloodTest !== 'none' ? `
              <div class="info-row">
                <span class="label">Blood Test:</span> ${getBloodTestDisplayName(data.bloodTest)}
              </div>
              ` : ''}
            </div>
            
            <h3>📍 Location</h3>
            <p>PawMilya Veterinary Clinic<br>
            Casa Vallejo Bldg.2, 2nd Floor<br>
            Baguio, 2600 Benguet</p>
            
            <h3>📞 Contact Information</h3>
            <p>If you need to reschedule or have any questions, please contact us:</p>
            <ul>
              <li>Phone: 0998 551 4890</li>
              <li>Email: alqader77@gmail.com</li>
            </ul>
            
            <h3>⏰ Operating Hours</h3>
            <p>Monday to Friday: 8:00 AM - 12:00 PM & 2:00 PM - 5:00 PM</p>
            
            <h3>⚠️ Important Reminders</h3>
            <ul>
              <li>Please arrive 10-15 minutes before your scheduled appointment time</li>
              <li>Bring any relevant medical records or previous test results</li>
              <li>If your pet is on medication, please bring the medication or a list</li>
              <li>For first-time visits, please bring your pet's vaccination records</li>
            </ul>
            
            <p>We look forward to seeing you and ${data.petName}!</p>
            
            <p>Best regards,<br>
            The PawMilya Veterinary Clinic Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated confirmation email. Please do not reply to this message.</p>
            <p>© 2024 PawMilya Veterinary Clinic. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Appointment Confirmation - ${data.petName}

Dear ${data.ownerName},

Thank you for booking an appointment with PawMilya Veterinary Clinic. Your appointment has been successfully scheduled!

APPOINTMENT DETAILS:
- Pet Name: ${data.petName}
- Pet Species: ${formatPetSpecies(data.petSpecies)}
- Service: ${serviceDisplayName}
- Date: ${formattedDate}
- Time: ${data.timeSlot}${bloodTestInfo}
${data.additionalInfo ? `- Additional Information: ${data.additionalInfo}` : ''}

LOCATION:
PawMilya Veterinary Clinic
Casa Vallejo Bldg.2, 2nd Floor
Baguio, 2600 Benguet

CONTACT INFORMATION:
If you need to reschedule or have any questions, please contact us:
- Phone: 0998 551 4890
- Email: alqader77@gmail.com

OPERATING HOURS:
Monday to Friday: 8:00 AM - 12:00 PM & 2:00 PM - 5:00 PM

IMPORTANT REMINDERS:
- Please arrive 10-15 minutes before your scheduled appointment time
- Bring any relevant medical records or previous test results
- If your pet is on medication, please bring the medication or a list
- For first-time visits, please bring your pet's vaccination records

We look forward to seeing you and ${data.petName}!

Best regards,
The PawMilya Veterinary Clinic Team

---
This is an automated confirmation email. Please do not reply to this message.
© 2024 PawMilya Veterinary Clinic. All rights reserved.
    `
  };
};

const getServiceDisplayName = (service: string): string => {
  const serviceMap: { [key: string]: string } = {
    'general-consultation': 'General Consultation',
    'vaccination': 'Vaccination',
    'grooming': 'Pet Grooming',
    'surgery': 'Surgery',
    'dental': 'Dental Care',
    'emergency': 'Emergency Care',
    'checkup': 'Regular Checkup',
    'deworming': 'Deworming',
    'blood-test': 'Blood Test'
  };
  return serviceMap[service] || service;
};

const getBloodTestDisplayName = (bloodTest: string): string => {
  const bloodTestMap: { [key: string]: string } = {
    'basic': 'Basic Blood Test',
    'comprehensive': 'Comprehensive Blood Test',
    'senior': 'Senior Pet Blood Test',
    'pre-surgery': 'Pre-Surgery Blood Test'
  };
  return bloodTestMap[bloodTest] || bloodTest;
};

const formatPetSpecies = (species: string): string => {
  return species.charAt(0).toUpperCase() + species.slice(1);
};
