"""SMTP delivery for password reset links."""
import logging
import os
import smtplib
import ssl
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email import encoders
from email.utils import formataddr

logger = logging.getLogger(__name__)


def is_smtp_configured() -> bool:
    """True if SMTP_HOST is set (same for every request — safe to expose to API)."""
    return bool(os.getenv("SMTP_HOST", "").strip())


def send_password_reset_email(to_email: str, reset_link: str) -> bool:
    """
    Send reset email when SMTP is configured.
    Returns True only if the message was accepted by the SMTP server.
    """
    host = os.getenv("SMTP_HOST", "").strip()
    if not host:
        logger.debug("SMTP_HOST not set; skipping send_password_reset_email")
        return False

    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.getenv("SMTP_USER", "").strip()
    password = os.getenv("SMTP_PASSWORD", "")
    from_addr = os.getenv("SMTP_FROM", user or "noreply@localhost")
    from_name = os.getenv("SMTP_FROM_NAME", "").strip()
    use_tls = os.getenv("SMTP_TLS", "true").lower() in ("1", "true", "yes")
    use_ssl = os.getenv("SMTP_USE_SSL", "").lower() in ("1", "true", "yes")

    subject = os.getenv(
        "SMTP_RESET_SUBJECT",
        "Reset your password - Planet Electro Labs",
    )
    body = (
        "You requested a password reset.\n\n"
        f"Open this link to choose a new password (valid for one hour):\n{reset_link}\n\n"
        "If you did not request this, you can ignore this email."
    )

    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    if from_name:
        msg["From"] = formataddr((from_name, from_addr))
    else:
        msg["From"] = from_addr
    msg["To"] = to_email

    ctx = ssl.create_default_context()

    try:
        if use_ssl:
            # Port 465 / implicit TLS (e.g. many providers)
            with smtplib.SMTP_SSL(host, port, context=ctx, timeout=45) as smtp:
                if user:
                    smtp.login(user, password)
                smtp.sendmail(from_addr, [to_email], msg.as_string())
        else:
            with smtplib.SMTP(host, port, timeout=45) as smtp:
                smtp.ehlo()
                if use_tls:
                    smtp.starttls(context=ctx)
                    smtp.ehlo()
                if user:
                    smtp.login(user, password)
                smtp.sendmail(from_addr, [to_email], msg.as_string())
        logger.info("Password reset email sent to %s", to_email)
        return True
    except Exception:
        logger.exception(
            "SMTP failed for password reset to %s (host=%s port=%s). "
            "Check SMTP credentials, TLS vs SSL (SMTP_USE_SSL), and firewall.",
            to_email,
            host,
            port,
        )
        return False


def send_email_with_pdf_attachment(
    to_email: str,
    subject: str,
    body_plain: str,
    pdf_bytes: bytes,
    pdf_filename: str,
) -> bool:
    """
    Send a plain-text message with one PDF attachment (same SMTP settings as reset mail).
    """
    host = os.getenv("SMTP_HOST", "").strip()
    if not host:
        logger.debug("SMTP_HOST not set; skipping send_email_with_pdf_attachment")
        return False

    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.getenv("SMTP_USER", "").strip()
    password = os.getenv("SMTP_PASSWORD", "")
    from_addr = os.getenv("SMTP_FROM", user or "noreply@localhost")
    from_name = os.getenv("SMTP_FROM_NAME", "").strip()
    use_tls = os.getenv("SMTP_TLS", "true").lower() in ("1", "true", "yes")
    use_ssl = os.getenv("SMTP_USE_SSL", "").lower() in ("1", "true", "yes")

    msg = MIMEMultipart()
    msg["Subject"] = subject
    if from_name:
        msg["From"] = formataddr((from_name, from_addr))
    else:
        msg["From"] = from_addr
    msg["To"] = to_email
    msg.attach(MIMEText(body_plain, "plain", "utf-8"))

    part = MIMEBase("application", "pdf")
    part.set_payload(pdf_bytes)
    encoders.encode_base64(part)
    part.add_header(
        "Content-Disposition",
        "attachment",
        filename=pdf_filename or "observations.pdf",
    )
    msg.attach(part)

    ctx = ssl.create_default_context()

    try:
        if use_ssl:
            with smtplib.SMTP_SSL(host, port, context=ctx, timeout=45) as smtp:
                if user:
                    smtp.login(user, password)
                smtp.sendmail(from_addr, [to_email], msg.as_string())
        else:
            with smtplib.SMTP(host, port, timeout=45) as smtp:
                smtp.ehlo()
                if use_tls:
                    smtp.starttls(context=ctx)
                    smtp.ehlo()
                if user:
                    smtp.login(user, password)
                smtp.sendmail(from_addr, [to_email], msg.as_string())
        logger.info("Observation PDF email sent to %s", to_email)
        return True
    except Exception:
        logger.exception(
            "SMTP failed for observation PDF to %s (host=%s port=%s).",
            to_email,
            host,
            port,
        )
        return False
