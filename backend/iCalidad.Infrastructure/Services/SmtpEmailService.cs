using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using iCalidad.Application.Common.Interfaces;

namespace iCalidad.Infrastructure.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<SmtpEmailService> _logger;

        public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(
            string toEmail,
            string subject,
            string htmlBody,
            CancellationToken cancellationToken = default)
        {
            var host = _configuration["Smtp:Host"];
            var portValue = _configuration["Smtp:Port"];
            var user = _configuration["Smtp:User"];
            var password = _configuration["Smtp:Password"];
            var from = _configuration["Smtp:From"] ?? user ?? "noreply@icalidad.local";
            var enableSsl = !bool.TryParse(_configuration["Smtp:EnableSsl"], out var parsedSsl) || parsedSsl;

            if (string.IsNullOrWhiteSpace(host))
            {
                _logger.LogWarning(
                    "[DEV EMAIL FALLBACK] Smtp:Host no configurado. Correo destinado a {To} | Asunto: {Subject}\n{Body}",
                    toEmail,
                    subject,
                    htmlBody);
                return;
            }

            var port = int.TryParse(portValue, out var parsedPort) ? parsedPort : 587;

            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(from));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;
            message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

            var socketOptions = !enableSsl
                ? SecureSocketOptions.None
                : port == 465
                    ? SecureSocketOptions.SslOnConnect
                    : SecureSocketOptions.StartTls;

            using var client = new SmtpClient();
            await client.ConnectAsync(host, port, socketOptions, cancellationToken);

            if (!string.IsNullOrWhiteSpace(user) && !string.IsNullOrWhiteSpace(password))
            {
                await client.AuthenticateAsync(user, password, cancellationToken);
            }

            await client.SendAsync(new MailKit.SendRequest(message), cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);
        }
    }
}
