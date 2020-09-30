import { parseMarkdown } from "auspice/src/util/parseMarkdown";
import { createTitleSlideFromFrontmatter } from "auspice/src/util/parseNarrative";


/**
 * Helper functions which convert the user-modified (or created) data from a
 * narrative slide into the correct `block` structure which Auspice expects.
 */

export const createOpeningSlide = (editorState) => {
  return createTitleSlideFromFrontmatter(JSON.parse(editorState.frontMatter), parseMarkdown);
};

export const createNormalSlide = (editorState) => {
  const block = {...editorState};
  Object.keys(block).forEach((key) => block[key] === undefined && delete block[key]); // remove keys with undefined values
  delete block.errorMessage;
  // `sidebarDisplayMarkdown` doesn't actually contain the h1 title string. This is overly confusing.
  block.__html = parseMarkdown(`# ${block.title}\n${block.sidebarDisplayMarkdown}`);
  return block;
};

