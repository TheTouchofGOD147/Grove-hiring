"use client";

import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [frontFileName, setFrontFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formElement = e.currentTarget;

    setLoading(true);
    setStatus("");
    setSuccess(false);

    const form = new FormData(formElement);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus(
          "Your information has been submitted successfully."
        );

        setSuccess(true);

        formElement.reset();

        setFrontFileName("");
        setBackFileName("");
      } else {
        setStatus(
          data?.error ||
            "Submission failed. Please review your information and try again."
        );
      }
    } catch {
      setStatus(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="overlay" />

      <section className="layout">

        {/* LEFT SIDE */}

        <div className="intro">
          <div className="eyebrow">
            SECURE DOCUMENT SUBMISSION
          </div>

          <h1>
            Identification
            <span> Verification Portal</span>
          </h1>

          <p className="introText">
            Submit your information and identification
            documents using the secure form provided.
          </p>

          <div className="securityNote">
            <span className="securityIcon">
              ✓
            </span>

            <div>
              <strong>
                Document Submission
              </strong>

              <p>
                Make sure your identification documents
                are clear, readable, and fully visible
                before submitting.
              </p>
            </div>
          </div>
        </div>


        {/* FORM CARD */}

        <div className="card">

          <div className="cardHeader">

            <p className="cardEyebrow">
              DOCUMENT VERIFICATION
            </p>

            <h2>
              Submit Your Identification
            </h2>

            <p>
              Complete your information and upload
              your identification documents below.
            </p>

          </div>


          <form
            onSubmit={submit}
            className="form"
          >

            {/* HONEYPOT */}

            <input
              name="website"
              className="honeypot"
              tabIndex={-1}
              autoComplete="off"
            />


            {/* FULL NAME */}

            <div className="field">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                required
                disabled={loading}
              />

            </div>


            {/* EMAIL + PHONE */}

            <div className="twoColumns">

              <div className="field">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  disabled={loading}
                />

              </div>


              <div className="field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  required
                  disabled={loading}
                />

              </div>

            </div>


            {/* DATE OF BIRTH */}

            <div className="field">

              <label htmlFor="dob">
                Date of Birth
              </label>

              <input
                id="dob"
                name="dob"
                type="text"
                placeholder="MM/DD/YYYY"
                pattern="\d{2}/\d{2}/\d{4}"
                title="Use MM/DD/YYYY format"
                inputMode="numeric"
                required
                disabled={loading}
              />

            </div>


            {/* ADDRESS */}

            <div className="field">

              <label htmlFor="address">
                Full Home Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                placeholder="Street, city, state and ZIP code"
                autoComplete="street-address"
                required
                disabled={loading}
              />

            </div>


            {/* ID DOCUMENTS */}

            <div className="documentSection">

              <div className="documentHeading">

                <h3>
                  Identification Documents
                </h3>

                <p>
                  Upload clear copies of the front
                  and back of your identification card.
                </p>

              </div>


              <div className="uploadGrid">

                {/* FRONT ID */}

                <label
                  className={
                    frontFileName
                      ? "uploadBox selected"
                      : "uploadBox"
                  }
                >

                  <span className="uploadIcon">
                    {frontFileName ? "✓" : "↑"}
                  </span>

                  <strong>
                    Front of ID
                  </strong>

                  <small>
                    Upload the front of your
                    identification card
                  </small>


                  {frontFileName ? (

                    <span className="selectedFile">
                      ✓ {frontFileName}
                    </span>

                  ) : (

                    <span className="chooseFile">
                      Choose File
                    </span>

                  )}


                  <input
                    type="file"
                    name="idFront"
                    disabled={loading}

                    onChange={(e) => {
                      const file =
                        e.target.files?.[0];

                      setFrontFileName(
                        file ? file.name : ""
                      );
                    }}
                  />

                </label>


                {/* BACK ID */}

                <label
                  className={
                    backFileName
                      ? "uploadBox selected"
                      : "uploadBox"
                  }
                >

                  <span className="uploadIcon">
                    {backFileName ? "✓" : "↑"}
                  </span>

                  <strong>
                    Back of ID
                  </strong>

                  <small>
                    Upload the back of your
                    identification card
                  </small>


                  {backFileName ? (

                    <span className="selectedFile">
                      ✓ {backFileName}
                    </span>

                  ) : (

                    <span className="chooseFile">
                      Choose File
                    </span>

                  )}


                  <input
                    type="file"
                    name="idBack"
                    disabled={loading}

                    onChange={(e) => {
                      const file =
                        e.target.files?.[0];

                      setBackFileName(
                        file ? file.name : ""
                      );
                    }}
                  />

                </label>

              </div>


              <p className="fileHelp">
                Maximum upload size: 5 MB per file.
              </p>

            </div>


            {/* CONFIRMATION */}

            <label className="confirmation">

              <input
                type="checkbox"
                name="confirmation"
                required
                disabled={loading}
              />

              <span>
                I confirm that the information
                and documents I am submitting
                are accurate and belong to me.
              </span>

            </label>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
            >

              {loading
                ? "Submitting your information..."
                : "Submit Identification"}

            </button>


            {/* PROCESSING NOTICE */}

            {loading && (

              <div className="processingNotice">

                <span className="spinner" />

                <div>
                  <strong>
                    Please keep this page open
                  </strong>

                  <p>
                    Your information and documents are
                    being submitted. Larger files may
                    take a few moments to process.
                  </p>
                </div>

              </div>

            )}


            {/* SUCCESS */}

            {status && success && (

              <div className="successBox">

                <div className="checkmark">

                  <svg viewBox="0 0 52 52">

                    <circle
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />

                    <path
                      fill="none"
                      d="M14 27l7 7 16-16"
                    />

                  </svg>

                </div>

                <p>
                  {status}
                </p>

              </div>

            )}


            {/* ERROR */}

            {status && !success && (

              <div className="error">
                {status}
              </div>

            )}

          </form>

        </div>

      </section>


      <style jsx>{`

        * {
          box-sizing: border-box;
        }


        .page {
          position: relative;

          min-height: 100vh;

          padding: 70px 24px;

          display: flex;

          align-items: center;

          justify-content: center;

          font-family:
            Inter,
            Arial,
            Helvetica,
            sans-serif;

          background:
            linear-gradient(
              110deg,
              rgba(10, 22, 18, 0.91),
              rgba(15, 31, 25, 0.69)
            ),
            url("/housing-background.jpg")
            center / cover no-repeat fixed;

          overflow: hidden;
        }


        .overlay {
          position: absolute;

          inset: 0;

          background:
            radial-gradient(
              circle at 15% 15%,
              rgba(211, 169, 94, 0.17),
              transparent 32%
            ),
            linear-gradient(
              to bottom,
              rgba(5, 15, 12, 0.05),
              rgba(5, 15, 12, 0.35)
            );

          pointer-events: none;
        }


        .layout {
          position: relative;

          z-index: 1;

          width: 100%;

          max-width: 1180px;

          display: grid;

          grid-template-columns:
            minmax(0, 0.9fr)
            minmax(480px, 1.1fr);

          align-items: center;

          gap: 80px;
        }


        /* LEFT SIDE */

        .intro {
          color: #ffffff;

          max-width: 520px;
        }


        .eyebrow {
          display: inline-block;

          margin-bottom: 20px;

          color: #e4bd76;

          font-size: 12px;

          font-weight: 800;

          letter-spacing: 2.4px;
        }


        .intro h1 {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size:
            clamp(48px, 5vw, 72px);

          line-height: 1.03;

          font-weight: 500;

          letter-spacing: -2px;
        }


        .intro h1 span {
          display: block;

          color: #e6bd74;
        }


        .introText {
          max-width: 490px;

          margin: 25px 0 0;

          color:
            rgba(255, 255, 255, 0.78);

          font-size: 17px;

          line-height: 1.75;
        }


        .securityNote {
          margin-top: 38px;

          padding-top: 27px;

          display: flex;

          gap: 15px;

          border-top:
            1px solid
            rgba(255, 255, 255, 0.17);
        }


        .securityIcon {
          width: 35px;

          height: 35px;

          flex: 0 0 35px;

          display: flex;

          align-items: center;

          justify-content: center;

          border:
            1px solid
            rgba(230, 189, 116, 0.55);

          border-radius: 50%;

          color: #e6bd74;

          font-weight: 800;
        }


        .securityNote strong {
          font-size: 14px;
        }


        .securityNote p {
          margin: 5px 0 0;

          color:
            rgba(255, 255, 255, 0.67);

          font-size: 13px;

          line-height: 1.6;
        }


        /* CARD */

        .card {
          width: 100%;

          padding: 42px;

          background:
            rgba(255, 255, 255, 0.97);

          border:
            1px solid
            rgba(255, 255, 255, 0.65);

          border-radius: 22px;

          box-shadow:
            0 35px 90px
            rgba(0, 0, 0, 0.28);

          backdrop-filter:
            blur(12px);
        }


        .cardHeader {
          margin-bottom: 30px;
        }


        .cardEyebrow {
          margin: 0 0 9px;

          color: #a3772f;

          font-size: 11px;

          font-weight: 800;

          letter-spacing: 2px;
        }


        .cardHeader h2 {
          margin: 0;

          color: #14241d;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 34px;

          line-height: 1.15;

          font-weight: 500;
        }


        .cardHeader > p:last-child {
          margin: 12px 0 0;

          color: #6d756f;

          font-size: 14px;

          line-height: 1.6;
        }


        /* FORM */

        .form {
          display: flex;

          flex-direction: column;

          gap: 18px;
        }


        .honeypot {
          position: absolute !important;

          left: -10000px !important;

          width: 1px !important;

          height: 1px !important;

          opacity: 0 !important;
        }


        .field {
          display: flex;

          flex-direction: column;

          gap: 7px;
        }


        .field label {
          color: #27352f;

          font-size: 12px;

          font-weight: 700;
        }


        .twoColumns {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 14px;
        }


        .field input {
          width: 100%;

          height: 49px;

          padding: 0 15px;

          border:
            1px solid #d8ddd9;

          border-radius: 8px;

          background: #fbfcfb;

          color: #18241e;

          font-size: 14px;

          transition:
            border 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }


        .field input::placeholder {
          color: #9aa29d;
        }


        .field input:focus {
          outline: none;

          background: #ffffff;

          border-color: #a77c35;

          box-shadow:
            0 0 0 3px
            rgba(167, 124, 53, 0.12);
        }


        .field input:disabled {
          opacity: 0.7;

          cursor: not-allowed;
        }


        /* DOCUMENT SECTION */

        .documentSection {
          margin-top: 4px;

          padding-top: 23px;

          border-top:
            1px solid #e4e7e5;
        }


        .documentHeading h3 {
          margin: 0;

          color: #1b2c24;

          font-size: 15px;
        }


        .documentHeading p {
          margin: 5px 0 15px;

          color: #79817c;

          font-size: 12px;

          line-height: 1.6;
        }


        .uploadGrid {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 13px;
        }


        .uploadBox {
          position: relative;

          min-height: 175px;

          padding: 20px 15px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;

          background: #faf9f5;

          border:
            1px dashed #c7b387;

          border-radius: 10px;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }


        .uploadBox:hover {
          background: #f7f2e8;

          border-color: #a3772f;

          transform:
            translateY(-2px);
        }


        .uploadBox.selected {
          background: #f2f8f4;

          border:
            1px solid #65a276;

          box-shadow:
            0 0 0 3px
            rgba(46, 125, 70, 0.07);
        }


        .uploadBox.selected:hover {
          background: #edf7f0;

          border-color: #3d8552;
        }


        .uploadIcon {
          width: 35px;

          height: 35px;

          margin-bottom: 9px;

          display: flex;

          align-items: center;

          justify-content: center;

          background: #efe5d1;

          border-radius: 50%;

          color: #906927;

          font-size: 20px;

          font-weight: bold;
        }


        .selected .uploadIcon {
          background: #dcefe2;

          color: #26703c;
        }


        .uploadBox strong {
          color: #25332d;

          font-size: 13px;
        }


        .uploadBox small {
          max-width: 180px;

          margin-top: 4px;

          color: #838a86;

          font-size: 10px;

          line-height: 1.45;
        }


        .chooseFile {
          margin-top: 11px;

          padding: 6px 11px;

          background: #efe5d1;

          border-radius: 5px;

          color: #956c28;

          font-size: 10px;

          font-weight: 800;
        }


        .selectedFile {
          max-width: 190px;

          margin-top: 11px;

          padding: 7px 10px;

          background: #dcefe2;

          border-radius: 5px;

          color: #26703c;

          font-size: 10px;

          font-weight: 800;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }


        .uploadBox input {
          position: absolute;

          inset: 0;

          width: 100%;

          height: 100%;

          opacity: 0;

          cursor: pointer;
        }


        .uploadBox input:disabled {
          cursor: not-allowed;
        }


        .fileHelp {
          margin: 9px 0 0;

          color: #8a918d;

          font-size: 10px;
        }


        /* CONFIRMATION */

        .confirmation {
          display: flex;

          align-items: flex-start;

          gap: 10px;

          color: #68716c;

          font-size: 11px;

          line-height: 1.55;
        }


        .confirmation input {
          width: 16px;

          height: 16px;

          margin-top: 2px;

          flex-shrink: 0;

          accent-color: #8d682a;
        }


        /* BUTTON */

        button {
          min-height: 54px;

          margin-top: 2px;

          border: none;

          border-radius: 8px;

          background:
            linear-gradient(
              135deg,
              #183a2c,
              #275a45
            );

          color: #ffffff;

          font-size: 14px;

          font-weight: 800;

          letter-spacing: 0.2px;

          cursor: pointer;

          box-shadow:
            0 12px 25px
            rgba(24, 58, 44, 0.18);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }


        button:hover:not(:disabled) {
          transform:
            translateY(-2px);

          box-shadow:
            0 17px 32px
            rgba(24, 58, 44, 0.25);
        }


        button:disabled {
          opacity: 0.72;

          cursor: not-allowed;
        }


        /* PROCESSING */

        .processingNotice {
          padding: 14px 16px;

          display: flex;

          align-items: center;

          gap: 13px;

          background: #faf7ef;

          border: 1px solid #eadfc7;

          border-radius: 9px;

          color: #4f574f;
        }


        .processingNotice strong {
          display: block;

          color: #183a2c;

          font-size: 12px;
        }


        .processingNotice p {
          margin: 3px 0 0;

          color: #747b77;

          font-size: 11px;

          line-height: 1.5;
        }


        .spinner {
          width: 22px;

          height: 22px;

          flex: 0 0 22px;

          border: 3px solid #dfd5c2;

          border-top-color: #8d682a;

          border-radius: 50%;

          animation:
            spin 0.8s linear infinite;
        }


        /* SUCCESS */

        .successBox {
          padding: 16px;

          text-align: center;

          background: #f2f8f4;

          border:
            1px solid #d4e8da;

          border-radius: 9px;

          color: #26703c;

          font-size: 13px;

          font-weight: 700;
        }


        .successBox p {
          margin: 7px 0 0;
        }


        .checkmark {
          width: 44px;

          margin: 0 auto;
        }


        .checkmark circle {
          stroke: #2e7d46;

          stroke-width: 3;

          stroke-dasharray: 157;

          stroke-dashoffset: 157;

          animation:
            circle 0.6s ease forwards;
        }


        .checkmark path {
          stroke: #2e7d46;

          stroke-width: 3;

          stroke-linecap: round;

          stroke-dasharray: 48;

          stroke-dashoffset: 48;

          animation:
            check 0.4s
            0.6s ease forwards;
        }


        /* ERROR */

        .error {
          padding: 12px 14px;

          background: #fff4f4;

          border:
            1px solid #f1cccc;

          border-radius: 8px;

          color: #b42318;

          text-align: center;

          font-size: 12px;

          font-weight: 700;
        }


        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }


        @keyframes circle {
          to {
            stroke-dashoffset: 0;
          }
        }


        @keyframes check {
          to {
            stroke-dashoffset: 0;
          }
        }


        /* TABLET */

        @media (max-width: 900px) {

          .page {
            padding:
              50px 20px;
          }


          .layout {
            max-width: 620px;

            grid-template-columns:
              1fr;

            gap: 38px;
          }


          .intro {
            text-align: center;

            margin: 0 auto;
          }


          .introText {
            margin-left: auto;

            margin-right: auto;
          }


          .securityNote {
            text-align: left;
          }

        }


        /* MOBILE */

        @media (max-width: 600px) {

          .page {
            padding:
              35px 14px;

            background:
              linear-gradient(
                rgba(10, 25, 19, 0.82),
                rgba(10, 25, 19, 0.86)
              ),
              url("/housing-background.jpg")
              center / cover no-repeat;
          }


          .intro h1 {
            font-size: 42px;
          }


          .introText {
            font-size: 15px;
          }


          .card {
            padding:
              27px 20px;

            border-radius: 17px;
          }


          .cardHeader h2 {
            font-size: 29px;
          }


          .twoColumns,
          .uploadGrid {
            grid-template-columns:
              1fr;
          }


          .uploadBox {
            min-height: 160px;
          }

        }

      `}</style>

    </main>
  );
}