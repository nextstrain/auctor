/* eslint-disable jsx-a11y/label-has-for */
import React from "react"; // eslint-disable-line import/no-extraneous-dependencies
import { connect } from "react-redux"; // eslint-disable-line import/no-extraneous-dependencies
import ReactEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';
import { changePage } from "auspice/src/actions/navigation";
import { computeChangePageArgs } from "auspice/src/components/narrative/index";
import { Container, Leader, Button } from "./styles";
import { createOpeningSlide, createNormalSlide } from "../utils/createSlide";

/**
 * The <Editor> should expose the UI to edit the currently-in-view narrative slide
 */
@connect((state) => {
  return {
    editor: state.editor,
    blocks: state.narrative.blocks,
    blockIdx: state.narrative.blockIdx
  };
})
class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.saveChangesToStore = this.saveChangesToStore.bind(this);
    // state in <Editor> is a similar structure to `this.props.blocks[this.props.blockIdx]`
    // but the content diverges as it's edited...
    const blankState = {
      dataset: undefined,
      query: undefined,
      sidebarDisplayMarkdown: undefined,
      mainDisplayMarkdown: undefined,
      frontMatter: undefined
    };
    this.state = {...blankState};
    this.blankState = blankState;
  }
  componentWillReceiveProps(nextProps) {
    /**
     * If a user has changed which narrative slide is in view
     * (or updated the underlying narrative) then we need to recompute
     * which slide we're allowing the user to edit.
     */
    if (!nextProps.blocks) {
      this.setState({...this.blankState});
      return;
    }
    const block = nextProps.blocks[nextProps.blockIdx];
    const newState = {...this.blankState};
    newState.dataset = block.dataset;
    newState.query = block.query;
    newState.title = block.title;
    if (block.frontMatter) newState.frontMatter = JSON.stringify(block.frontMatter, null, 2);
    if (block.sidebarDisplayMarkdown) newState.sidebarDisplayMarkdown = block.sidebarDisplayMarkdown;
    if (block.mainDisplayMarkdown) newState.mainDisplayMarkdown = block.mainDisplayMarkdown;
    this.setState(newState);
  }
  saveChangesToStore() {
    /**
     * Triggers the currently-edited slide to replace the previous version (i.e. the one in redux)
     * and thus the rendered narrative display to update...
     */
    const newBlocks = [...this.props.blocks];
    try {
      if (this.props.blockIdx===0) {
        newBlocks[0] = createOpeningSlide(this.state);
      } else {
        newBlocks[this.props.blockIdx] = createNormalSlide(this.state);
      }
    } catch (err) {
      console.error(err);
      this.setState({errorMessage: err.message});
      return;
    }
    /* First we change the redux state of the narrative blocks. This is enough for the narrative to
    automatically update via a normal react lifecycle method. But any query changes (in the redux block)
    do not update the dataset. */
    this.props.dispatch({
      type: "EXPERIMENTAL_NARRATIVE_CONTENT_CHANGE",
      narrative: newBlocks,
      query: {n: this.props.blockIdx} // needed as we are piggy-backing on the CLEAN_START action handling in the auspice reducer
    });
    /* Then update the app (viz) state deriving from the query in the block _if_ the query has changed.
    Dispatch is wrapped in a `setTimeout` to avoid bugs. Todo.
    Ideally this dispatch wouldn't exist... */
    if (newBlocks[this.props.blockIdx].query !== this.props.blocks[this.props.blockIdx].query) {
      window.setTimeout(
        () => {
          this.props.dispatch(changePage(computeChangePageArgs(newBlocks, this.props.blockIdx, this.props.blockIdx)));
        },
        100
      );
    }
  }
  renderSimpleForm(name, key) {
    return (
      <form>
        <label>
          {name}:
          <input type="text" value={this.state[key]} onChange={(event) => {const s={}; s[key]=event.target.value; this.setState(s);}}/>
        </label>
      </form>
    );
  }
  renderEditor(key, language) {
    return (
      <ReactEditor
        value={this.state[key]}
        onValueChange={(text) => {const s={}; s[key]=text; this.setState(s);}}
        padding={10}
        highlight={(code) => highlight(code, languages[language])}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          backgroundColor: "#EEEEEE"
        }}
      />
    );
  }
  renderErrors() {
    if (this.state.errorMessage) {
      return (
        <div style={{background: "red", color: "white"}}>
          {`Error message while attempting to parse the edited slide...`}
          <p/>
          {this.state.errorMessage}
        </div>
      );
    }
    return null;
  }
  render() {
    if (!this.props.blocks) return null;

    if (this.props.blockIdx===0) {                                 /* YAML frontmatter slide */
      return (
        <Container>
          <Leader>
            {`The opening slide of the narrative is defined via YAML frontmatter. This is here represented as JSON which you may edit:`}
          </Leader>
          {this.renderEditor('frontMatter', 'json')}
          <Button onClick={this.saveChangesToStore}>{`💥 update`}</Button>
          {this.renderErrors()}
        </Container>
      );
    } else if (this.props.blockIdx+1<this.props.blocks.length) {   /* "normal" slide */
      return (
        <Container>
          <Leader>
            {`👇 this is the content block behind narrative slide ${this.props.blockIdx}. You can edit it & press "update" to update the narrative.`}
          </Leader>
          {this.renderSimpleForm("Dataset", 'dataset')}
          {this.renderSimpleForm("Query", 'query')}
          {this.renderSimpleForm("Slide title", 'title')}
          <h4>Sidebar content (<a href="https://guides.github.com/features/mastering-markdown/">markdown</a> format)</h4>
          {this.state.sidebarDisplayMarkdown && this.renderEditor('sidebarDisplayMarkdown', 'markdown')}
          {this.state.mainDisplayMarkdown && (
            <>
              <h4>Main markdown content (replaces interactive panels)</h4>
              {this.renderEditor('mainDisplayMarkdown', 'markdown')}
            </>
          )}
          <br/>
          <Button onClick={this.saveChangesToStore}>{`💥 update`}</Button>
          {this.renderErrors()}
        </Container>
      );
    }
    /* End of Narrative slide */
    return (
      <Container>
        <Leader>
          Currently you cannot edit the final slide
        </Leader>
      </Container>
    );
  }
}

export default Editor;
