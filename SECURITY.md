# Security Policy

## Secrets

Never commit real environment variables, Supabase service-role keys, admin passwords, or user/member personal data.

Keep these values private:

- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_SECRET`
- any production `.env*` file

Use `.env.local.example` as a template only.

## Reporting a Vulnerability

If you find a security issue, please open a private advisory or contact the project maintainer privately before publishing details.

When reporting, include:

- affected route or file
- steps to reproduce
- expected impact
- suggested fix, if known
