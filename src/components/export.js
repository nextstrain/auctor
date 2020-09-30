import React from "react"; // eslint-disable-line import/no-extraneous-dependencies
import { connect } from "react-redux"; // eslint-disable-line import/no-extraneous-dependencies
import { FaDownload } from "react-icons/fa"; // eslint-disable-line import/no-extraneous-dependencies
import { safeDump } from "js-yaml"; // eslint-disable-line import/no-extraneous-dependencies
import { Container, Button } from "./styles";

/**
 * <Export> defines the UI for saving the markdown file which one has been
 * editing in the app
 */
@connect((state) => {
  return {
    blocks: state.narrative.blocks
  };
})
class Export extends React.Component {
  constructor(props) {
    super(props);
    this.download = this.download.bind(this);
  }
  download() {
    const markdown = this.props.blocks.map(blockToMarkdown).join("\n\n");
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdown));
    element.setAttribute('download', "edited-narrative.md");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  render() {
    if (!this.props.blocks) return null;
    return (
      <Container>
        <Button onClick={this.download}>
          <FaDownload/>{` download a local copy of the (edited) narrative markdown`}
        </Button>
      </Container>
    );
  }
}

export default Export;

const hardcodedDatasetHostName = "https://nextstrain.org"; // TODO. See https://github.com/nextstrain/auspice/issues/890

function blockToMarkdown(block) {
  if (block.frontMatter) {
    const yaml = safeDump(block.frontMatter);
    return `---\n${yaml}\n---\n`;
  }
  /* "normal" block */
  const url = new URL(block.dataset, hardcodedDatasetHostName);
  url.search = block.query;
  let md = `# [${block.title}](${url.toString()})`;
  md += block.sidebarDisplayMarkdown;
  if (block.mainDisplayMarkdown) {
    md += "\n```auspiceMainDisplayMarkdown\n";
    md += block.mainDisplayMarkdown.replace(/^\n/, "").replace(/\n$/, "");
    md += "\n```\n";
  }
  return md;
}
