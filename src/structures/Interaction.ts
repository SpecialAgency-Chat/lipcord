import { APIInteraction, InteractionType, LocaleString } from "discord-api-types/v10";

export class Interaction {
  public readonly id: string;
  public readonly applicationId: string;
  public readonly type: InteractionType;
  public data?: unknown;
  public guildId?: string;
  public channel?: Channel;
  public channelId?: string;
  public member?: GuildMember;
  public user?: User;
  public readonly token: string;
  public readonly version = 1;
  public readonly appPermissions?: Permissions;
  public readonly locale: LocaleString;
  public readonly guildLocale?: LocaleString;
  protected constructor(rawInteraction: APIInteraction) {
    this.id = rawInteraction.id;
    this.applicationId = rawInteraction.application_id;
    this.type = rawInteraction.type;
    this.data = rawInteraction.data;
    this.token = rawInteraction.token;
    if (rawInteraction.app_permissions) this.appPermissions = new Permissions(rawInteraction.app_permissions);
  }
}