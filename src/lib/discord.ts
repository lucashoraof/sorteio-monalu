interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields: DiscordEmbedField[];
  timestamp: string;
  footer?: {
    text: string;
  };
}

interface DiscordWebhookPayload {
  username?: string;
  avatar_url?: string;
  embeds: DiscordEmbed[];
}

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1432408679428132946/x5PH0dVwnvPLIJOgncOa-TXrrcYSv8ROtN4h42A2akhexTgmE8EsyFs0SG8Kd59XOg3J';

export const discordService = {
  async sendParticipantNotification(participant: { name: string; phone: string }) {
    try {
      const embed: DiscordEmbed = {
        title: '🎉 Novo Participante no Sorteio!',
        description: 'Uma nova pessoa se inscreveu no sorteio da Monalu!',
        color: 0x00ff00, // Verde
        fields: [
          {
            name: '👤 Nome',
            value: participant.name,
            inline: true
          },
          {
            name: '📱 Telefone',
            value: participant.phone,
            inline: true
          },
          {
            name: '📸 Instagram',
            value: 'Seguindo @monalu_oficial ✅',
            inline: true
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Sistema de Sorteio Monalu'
        }
      };

      const payload: DiscordWebhookPayload = {
        username: 'Sorteio Monalu',
        embeds: [embed]
      };

      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Discord webhook failed: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Discord webhook error:', error);
      // Não falha o cadastro se o Discord der erro
      return { success: false, error };
    }
  }
};
