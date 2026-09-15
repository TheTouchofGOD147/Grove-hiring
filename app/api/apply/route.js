import nodemailer from "nodemailer";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;


/*
 * -------------------------------------------------------
 * HTML ESCAPING
 * -------------------------------------------------------
 */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/*
 * -------------------------------------------------------
 * CHECK WHETHER A REAL FILE WAS UPLOADED
 * -------------------------------------------------------
 */

function isValidUpload(file) {
  return (
    file &&
    typeof file === "object" &&
    typeof file.arrayBuffer === "function" &&
    file.size > 0
  );
}


/*
 * -------------------------------------------------------
 * SAFE ATTACHMENT FILENAME
 * -------------------------------------------------------
 */

function safeFileName(name, fallbackName) {
  const cleaned = String(name || fallbackName)
    .replace(/[^\w.\-() ]/g, "_")
    .trim();

  return cleaned || fallbackName;
}


/*
 * -------------------------------------------------------
 * CREATE ORIGINAL ATTACHMENT
 * -------------------------------------------------------
 *
 * IMPORTANT:
 * The uploaded document is NOT resized,
 * compressed, converted or modified.
 * -------------------------------------------------------
 */

async function createAttachment(file, fallbackName) {
  if (!isValidUpload(file)) {
    return null;
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `${fallbackName} exceeds the 5 MB file-size limit.`
    );
  }

  const buffer = Buffer.from(
    await file.arrayBuffer()
  );

  return {
    filename: safeFileName(
      file.name,
      fallbackName
    ),

    content: buffer,

    contentType:
      file.type ||
      "application/octet-stream",
  };
}


/*
 * -------------------------------------------------------
 * POST
 * -------------------------------------------------------
 */

export async function POST(req) {
  try {
    const form = await req.formData();


    /*
     * -------------------------------------------------------
     * HONEYPOT
     * -------------------------------------------------------
     */

    if (form.get("website")) {
      return Response.json({
        ok: true,
      });
    }


    /*
     * -------------------------------------------------------
     * FORM INFORMATION
     * -------------------------------------------------------
     */

    const name = String(
      form.get("name") || ""
    ).trim();

    const email = String(
      form.get("email") || ""
    ).trim();

    const phone = String(
      form.get("phone") || ""
    ).trim();

    const dob = String(
      form.get("dob") || ""
    ).trim();

    const address = String(
      form.get("address") || ""
    ).trim();

    const confirmation =
      form.get("confirmation");

    const idFront =
      form.get("idFront");

    const idBack =
      form.get("idBack");


    /*
     * -------------------------------------------------------
     * VALIDATE REQUIRED INFORMATION
     * -------------------------------------------------------
     */

    if (
      !name ||
      !email ||
      !phone ||
      !dob ||
      !address
    ) {
      return Response.json(
        {
          ok: false,

          error:
            "Please complete all required information.",
        },
        {
          status: 400,
        }
      );
    }


    /*
     * -------------------------------------------------------
     * CONFIRMATION
     * -------------------------------------------------------
     */

    if (!confirmation) {
      return Response.json(
        {
          ok: false,

          error:
            "Please confirm that the submitted information is accurate.",
        },
        {
          status: 400,
        }
      );
    }


    /*
     * -------------------------------------------------------
     * PROCESS IDENTIFICATION DOCUMENTS
     * -------------------------------------------------------
     */

    let frontAttachment = null;
    let backAttachment = null;

    try {
      frontAttachment =
        await createAttachment(
          idFront,
          "front-of-id"
        );

      backAttachment =
        await createAttachment(
          idBack,
          "back-of-id"
        );
    } catch (uploadError) {
      return Response.json(
        {
          ok: false,

          error:
            uploadError instanceof Error
              ? uploadError.message
              : "Unable to process the uploaded document.",
        },
        {
          status: 400,
        }
      );
    }


    /*
     * -------------------------------------------------------
     * ATTACHMENTS
     * -------------------------------------------------------
     */

    const attachments = [
      frontAttachment,
      backAttachment,
    ].filter(Boolean);


    const hasFront =
      Boolean(frontAttachment);

    const hasBack =
      Boolean(backAttachment);


    /*
     * -------------------------------------------------------
     * DOCUMENT STATUS
     * -------------------------------------------------------
     */

    let documentStatusText = "";

    if (hasFront && hasBack) {
      documentStatusText =
        `Front of identification card: Uploaded
Back of identification card: Uploaded`;
    } else if (hasFront) {
      documentStatusText =
        `Front of identification card: Uploaded
Back of identification card: Not provided`;
    } else if (hasBack) {
      documentStatusText =
        `Front of identification card: Not provided
Back of identification card: Uploaded`;
    } else {
      documentStatusText =
        "No identification documents were uploaded.";
    }


    const documentStatusHtml = `
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="
          border-collapse:collapse;
          font-size:13px;
        "
      >

        <tr>

          <td
            style="
              padding:9px 0;
              border-bottom:1px solid #ebe9e2;
              color:#56615b;
            "
          >
            Front of identification card
          </td>

          <td
            align="right"
            style="
              padding:9px 0;
              border-bottom:1px solid #ebe9e2;
              color:${hasFront ? "#26703c" : "#8b8f8c"};
              font-weight:bold;
            "
          >
            ${hasFront ? "Uploaded" : "Not provided"}
          </td>

        </tr>


        <tr>

          <td
            style="
              padding:9px 0;
              color:#56615b;
            "
          >
            Back of identification card
          </td>

          <td
            align="right"
            style="
              padding:9px 0;
              color:${hasBack ? "#26703c" : "#8b8f8c"};
              font-weight:bold;
            "
          >
            ${hasBack ? "Uploaded" : "Not provided"}
          </td>

        </tr>

      </table>
    `;


    /*
     * -------------------------------------------------------
     * SMTP
     * -------------------------------------------------------
     */

    const transporter =
      nodemailer.createTransport({
        host:
          "mail.privateemail.com",

        port: 465,

        secure: true,

        auth: {
          user:
            process.env.EMAIL_USER,

          pass:
            process.env.EMAIL_PASSWORD,
        },

        connectionTimeout: 20000,
        greetingTimeout: 20000,

        /*
         * Give legitimate attachments enough
         * time without allowing the connection
         * to remain stuck indefinitely.
         */

        socketTimeout: 90000,
      });


    /*
     * -------------------------------------------------------
     * SAFE HTML VALUES
     * -------------------------------------------------------
     */

    const safeName =
      escapeHtml(name);

    const safeEmail =
      escapeHtml(email);

    const safePhone =
      escapeHtml(phone);

    const safeDob =
      escapeHtml(dob);

    const safeAddress =
      escapeHtml(address);


    /*
     * -------------------------------------------------------
     * SEND TO HR ONLY
     * -------------------------------------------------------
     *
     * NO automatic email is sent to the applicant.
     * -------------------------------------------------------
     */

    await transporter.sendMail({
      from:
        process.env.EMAIL_FROM,

      to:
        process.env.HR_EMAIL,

      replyTo:
        email,

      subject:
        `New Information Submission – ${name}`,


      /*
       * -------------------------------------------------------
       * PLAIN TEXT EMAIL
       * -------------------------------------------------------
       */

      text: `
New Information Submission

Name: ${name}
Email: ${email}
Phone: ${phone}
Date of Birth: ${dob}
Address: ${address}

Identification Documents:

${documentStatusText}

The submitter confirmed that the information
provided is accurate and belongs to them.
      `,


      /*
       * -------------------------------------------------------
       * HTML EMAIL
       * -------------------------------------------------------
       */

      html: `
        <div
          style="
            font-family:
              Arial,
              Helvetica,
              sans-serif;

            background:#f3f1eb;
            padding:30px;
            color:#1d2923;
          "
        >

          <div
            style="
              max-width:650px;
              margin:0 auto;
              background:#ffffff;
              border:1px solid #dedbd1;
              border-radius:14px;
              overflow:hidden;
            "
          >


            <!-- HEADER -->

            <div
              style="
                background:#183a2c;
                color:#ffffff;
                padding:24px;
              "
            >

              <div
                style="
                  color:#d9b46d;
                  font-size:11px;
                  font-weight:bold;
                  letter-spacing:1.5px;
                  text-transform:uppercase;
                  margin-bottom:6px;
                "
              >
                Secure Submission
              </div>


              <h2
                style="
                  margin:0;
                  font-size:22px;
                "
              >
                New Information Submission
              </h2>


              <p
                style="
                  margin:7px 0 0;
                  color:#dce7e1;
                  font-size:13px;
                "
              >
                Golden Harvest Grove
              </p>

            </div>


            <!-- BODY -->

            <div
              style="
                padding:26px;
              "
            >

              <h3
                style="
                  margin:0 0 18px;
                  color:#183a2c;
                  font-size:17px;
                "
              >
                Submitted Information
              </h3>


              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  border-collapse:collapse;
                  font-size:14px;
                "
              >


                <tr>

                  <td
                    style="
                      padding:10px;
                      border-bottom:1px solid #eeeeea;
                      color:#747b77;
                    "
                  >
                    Full Name
                  </td>

                  <td
                    style="
                      padding:10px;
                      border-bottom:1px solid #eeeeea;
                      font-weight:bold;
                    "
                  >
                    ${safeName}
                  </td>

                </tr>


                <tr>

                  <td
                    style="
                      padding:10px;
                      border-bottom:1px solid #eeeeea;
                      color:#747b77;
                    "
                  >
                    Email
                  </td>

                  <td
                    style="
                      padding:10px;
                      border-bottom:1px solid #eeeeea;
                    "
                  >
                    ${safeEmail}
                  </td>

                </tr>


                <tr>

                  <td
                    style="
                      padding:10px;
                      border-bottom:1px solid #eeeeea;
                      color:#747b77;
                    "
                  >
                    Phone
                  </td>

                  <td
                    style="
                      padding:10px;
                      border-bottom:1px solid #eeeeea;
                    "
                  >
                    ${safePhone}
                  </td>

                </tr>


                <tr>

                  <td
                    style="
                      padding:10px;
                      border-bottom:1px solid #eeeeea;
                      color:#747b77;
                    "
                  >
                    Date of Birth
                  </td>

                  <td
                    style="
                      padding:10px;
                      border-bottom:1px solid #eeeeea;
                    "
                  >
                    ${safeDob}
                  </td>

                </tr>


                <tr>

                  <td
                    style="
                      padding:10px;
                      color:#747b77;
                    "
                  >
                    Address
                  </td>

                  <td
                    style="
                      padding:10px;
                    "
                  >
                    ${safeAddress}
                  </td>

                </tr>

              </table>


              <!-- IDENTIFICATION STATUS -->

              <div
                style="
                  margin-top:24px;
                  padding:17px;
                  background:#faf7ef;
                  border-left:4px solid #b68a42;
                "
              >

                <strong
                  style="
                    color:#183a2c;
                  "
                >
                  Identification Documents
                </strong>


                <div
                  style="
                    margin-top:8px;
                  "
                >
                  ${documentStatusHtml}
                </div>

              </div>


              <p
                style="
                  margin:22px 0 0;
                  color:#777f7a;
                  font-size:11px;
                  line-height:1.6;
                "
              >
                Any identification files provided
                by the submitter are attached to
                this email in their original
                uploaded format.
              </p>

            </div>

          </div>

        </div>
      `,


      /*
       * -------------------------------------------------------
       * ORIGINAL ATTACHMENTS
       * -------------------------------------------------------
       */

      attachments,
    });


    /*
     * -------------------------------------------------------
     * SUCCESS
     * -------------------------------------------------------
     */

    return Response.json({
      ok: true,

      uploaded: {
        front:
          hasFront,

        back:
          hasBack,
      },
    });

  } catch (err) {

    /*
     * Don't log the applicant's personal
     * information or attachment contents.
     */

    console.error(
      "Submission error:",
      err instanceof Error
        ? err.message
        : "Unknown submission error"
    );


    return Response.json(
      {
        ok: false,

        error:
          "Unable to process the submission. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}