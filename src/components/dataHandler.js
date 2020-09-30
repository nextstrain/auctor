import React from "react"; // eslint-disable-line import/no-extraneous-dependencies
import { connect } from "react-redux"; // eslint-disable-line import/no-extraneous-dependencies
import { FaFile } from "react-icons/fa"; // eslint-disable-line import/no-extraneous-dependencies
import styled from "styled-components"; // eslint-disable-line import/no-extraneous-dependencies
import { parseMarkdown } from "auspice/src/util/parseMarkdown";
import { parseMarkdownNarrativeFile } from "auspice/src/util/parseNarrative";
import { getDatasetFromCharon } from "auspice/src/actions/loadData";
import { getDatasetAndDispatch } from "../actions/getData";
import { Container, Leader, Button } from "./styles";


const Background = styled.div`
  ${(props) => props.dragging ? "background-color: #0099CC;" : ""}
`;

/**
 * The <DataHandler> component is the UI for loading a narrative to begin with
 * (e.g. via drag&drop of a markdown or some API). It's not currently possible
 * to start creating a narrative from scratch in the app.
 */
@connect((state) => {
  return {
    blocks: state.narrative.blocks
  };
})class DataHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dragging: false};
    this.loadStartingNarrativeFromMarkdown = this.loadStartingNarrativeFromMarkdown.bind(this);
  }
  componentDidMount() {
    document.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.setState({dragging: true});
    }, false);
    document.addEventListener("drop", (e) => {
      e.preventDefault();
      this.setState({dragging: false});
      handleDroppedMarkdown(this.props.dispatch, e.dataTransfer.files);
    }, false);
  }
  /* Load a starting narrative via charon's API handlers (i.e. those on nextstrain.org) */
  async loadStartingNarrativeFromMarkdown() {
    const md = await getDatasetFromCharon("test", {narrative: true, type: "md"})
        .then((res) => res.text())
    console.log(md, parseMarkdownNarrativeFile, parseMarkdown)
    const narrativeBlocks = parseMarkdownNarrativeFile(md, parseMarkdown)
    console.log("narrativeBlocks", narrativeBlocks);
    getDatasetAndDispatch(this.props.dispatch, narrativeBlocks);
  }
  render() {
    if (this.props.blocks) {
      // to-do: render a button to trash the current narrative & go back to a fresh start. Currently you can simply refresh the page.
      return null;
    }
    return (
      <Background dragging={this.state.dragging}>
        <Container>
          <Button onClick={this.loadStartingNarrativeFromMarkdown}>
            Load example narrative from markdown via API call
          </Button>
          <Leader>
            <FaFile/>{` Or drag and drop a narrative (markdown file) here!`}
          </Leader>
        </Container>
      </Background>
    );
  }
}

export default DataHandler;


function handleDroppedMarkdown(dispatch, files) {
  const reader = new window.FileReader();
  // reader.onloadstart = () => {
  //   console.log("Reading Mardown (dropped)");
  // };
  reader.onload = (event) => {
    const narrativeBlocks = parseMarkdownNarrativeFile(event.target.result, parseMarkdown);
    console.log("Blocks from dropped file:", narrativeBlocks);
    getDatasetAndDispatch(dispatch, narrativeBlocks);
  };
  reader.onerror = handleDroppedFileError;

  if (files.length > 1 || !files[0].name.endsWith(".md")) {
    console.error("Can only process a single Markdown file currently");
    return;
  }
  reader.readAsText(files[0]);
}

function handleDroppedFileError(err) {
  console.error("Error reading Markdown", err);
  console.error("Please make a GitHub Issue so we can fix this!")
}
