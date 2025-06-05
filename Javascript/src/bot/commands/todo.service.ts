import {
  Context,
  createCommandGroupDecorator,
  IntegerOption,
  Options,
  StringOption,
  Subcommand,
} from 'necord';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';

export const TodoListCommandDecorator = createCommandGroupDecorator({
  name: 'todo',
  description: 'Comandos da lista de tarefas',
  guilds: [String(process.env.GUILD_ID)],
});

class TaskDTO {
  title: string;
  completed: boolean;
}

class TaskTitleDTO {
  @StringOption({
    name: 'title',
    description: 'Título da tarefa',
    required: true,
  })
  title: string;
}

class TaskIndexDTO {
  @IntegerOption({
    name: 'id',
    description: 'Índice da tarefa na lista',
    required: true,
  })
  id: number;
}

@TodoListCommandDecorator()
export class TodoListCommands {
  private tasks: TaskDTO[] = [];

  private activeCollector: ReturnType<
    import('discord.js').Message['createMessageComponentCollector']
  > | null = null;

  private generateEmbed(): EmbedBuilder {
    if (this.tasks.length === 0) {
      return new EmbedBuilder()
        .setTitle('📋 Lista de Tarefas')
        .setDescription('Nenhuma tarefa encontrada.')
        .setColor(0x808080);
    }

    const description = this.tasks
      .map(
        (task, i) =>
          `${task.completed ? '✅ ~~' : '🔲 '}${i + 1}. ${task.title}${
            task.completed ? '~~' : ''
          }`,
      )
      .join('\n');

    return new EmbedBuilder()
      .setTitle('📋 Lista de Tarefas')
      .setDescription(description)
      .setColor(0x00bfff);
  }

  private generateSelectMenu(): StringSelectMenuBuilder {
    return new StringSelectMenuBuilder()
      .setCustomId('check_task')
      .setPlaceholder('Marcar/desmarcar tarefas...')
      .setMinValues(1)
      .setMaxValues(this.tasks.length)
      .addOptions(
        this.tasks.map((task, i) => ({
          label: `${i + 1}. ${task.title}`,
          value: i.toString(),
          description: task.completed ? 'Concluída' : 'Pendente',
        })),
      );
  }

  private generateButtonRow(): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('delete_all')
        .setLabel('🧹 Limpar tudo')
        .setStyle(ButtonStyle.Danger),
    );
  }

  @Subcommand({ name: 'add', description: 'Adiciona uma nova tarefa' })
  public async onAdd(
    @Context() [interaction]: [CommandInteraction],
    @Options() { title }: TaskTitleDTO,
  ) {
    this.tasks.push({ title, completed: false });
    await interaction.reply(`✅ Tarefa adicionada: **${title}**`);
  }

  @Subcommand({ name: 'list', description: 'Exibe todas as tarefas' })
  public async onList(@Context() [interaction]: [CommandInteraction]) {
    const embed = this.generateEmbed();

    if (this.activeCollector) {
      this.activeCollector.stop(); // Finaliza o collector anterior
      this.activeCollector = null;
    }

    const components: (
      | ActionRowBuilder<ButtonBuilder>
      | ActionRowBuilder<StringSelectMenuBuilder>
    )[] = [];

    if (this.tasks.length > 0) {
      const selectRow =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          this.generateSelectMenu(),
        );
      components.push(selectRow);
    }

    components.push(this.generateButtonRow());

    const message = await interaction.reply({
      embeds: [embed],
      components,
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 45_000,
    });
    this.activeCollector = collector;

    collector.on('collect', async (i) => {
      if (i.isStringSelectMenu() && i.customId === 'check_task') {
        for (const value of i.values) {
          const index = parseInt(value);
          this.tasks[index].completed = !this.tasks[index].completed;
        }

        const updatedEmbed = this.generateEmbed();
        const updatedRow =
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            this.generateSelectMenu(),
          );

        await i.update({
          embeds: [updatedEmbed],
          components: [updatedRow, this.generateButtonRow()],
        });
      }

      if (i.isButton() && i.customId === 'delete_all') {
        this.tasks = [];
        await i.update({
          embeds: [this.generateEmbed()],
          components: [this.generateButtonRow()],
        });
      }
    });

    collector.on('end', async () => {
      try {
        await interaction.editReply({ components: [] });
      } catch {}
    });
  }

  @Subcommand({ name: 'check', description: 'Marca/desmarca uma tarefa' })
  public async onCheck(
    @Context() [interaction]: [CommandInteraction],
    @Options() { id }: TaskIndexDTO,
  ) {
    const index = id - 1;

    if (!this.tasks[index]) {
      await interaction.reply('❌ Índice inválido.');
      return;
    }

    this.tasks[index].completed = !this.tasks[index].completed;
    const status = this.tasks[index].completed ? 'concluída' : 'pendente';

    await interaction.reply(
      `🔄 Tarefa **${index + 1}** marcada como **${status}**.`,
    );
  }

  @Subcommand({ name: 'remove', description: 'Remove uma tarefa' })
  public async onRemove(
    @Context() [interaction]: [CommandInteraction],
    @Options() { id }: TaskIndexDTO,
  ) {
    const index = id - 1;

    if (!this.tasks[index]) {
      await interaction.reply('❌ Índice inválido.');
      return;
    }

    const removed = this.tasks.splice(index, 1);
    await interaction.reply(`🗑️ Tarefa removida: **${removed[0].title}**`);
  }
}
