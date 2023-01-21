import { MentionModel } from 'components/ui/input-mention/InputMention';

export const converterMentionsHtmlToString = (
  data: string,
  mentions: MentionModel[],
) => {
  let dataConverter = data
    ?.replaceAll('<p>', '')
    ?.replaceAll('</p>', '')
    ?.replaceAll('&nbsp;', ' ')
    ?.replaceAll('</span>', '');

  mentions.forEach((item) => {
    dataConverter = dataConverter?.replaceAll(
      `<span class="mention" data-mention="${item.id}">`,
      '',
    );
    dataConverter = dataConverter?.replaceAll(
      `${item.id}`,
      `${item.id}`.slice(1),
    );
  });
  return dataConverter?.trim() || '';
};
