SECRET_KEY = ''

ANYMAIL = {
    "MAILGUN_API_KEY": '',
}
EMAIL_BACKEND = "anymail.backends.mailgun.EmailBackend"

MAILGUN_API_URL = ""

DEFAULT_FROM_EMAIL = 'Djose Demo <postmaster@mailgun.org>'
EMAIL_SUBJECT_PREFIX = '[Djose Demo ] '
SERVER_EMAIL = DEFAULT_FROM_EMAIL