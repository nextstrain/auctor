import React from "react"; // eslint-disable-line import/no-extraneous-dependencies
import { connect } from "react-redux"; // eslint-disable-line import/no-extraneous-dependencies
import { changePage } from "auspice/src/actions/navigation";
import { computeChangePageArgs } from "auspice/src/components/narrative/index";
import { Container, Leader, Fineprint, Button, Hr } from "./styles";


/**
 * Given a loaded narrative (i.e. one which has redux state) we want to show a summary
 * of the different slides for editing and allow naviation between them.
 */

@connect((state) => {
  return {
    blocks: state.narrative.blocks,
    title: state.narrative.title,
    blockIdx: state.narrative.blockIdx
  };
})
class Summary extends React.Component {
  constructor(props) {
    super(props);
    this.jumpToSlide = this.jumpToSlide.bind(this);
  }
  jumpToSlide(n) {
    this.props.dispatch(changePage(computeChangePageArgs(this.props.blocks, this.props.blockIdx, n)));
  }
  chooseNarrativeSlide() {
    return (
      this.props.blocks.map((block, idx) => (
        <Button key={block.__html} selected={idx === this.props.blockIdx} onClick={() => this.jumpToSlide(idx)}>{idx}</Button>
      ))
    );
  }
  render() {
    return (
      <Container>
        <Leader>{`Summary of current Narrative ${this.props.blocks && `("${this.props.title}")`}`}</Leader>
        {this.props.blocks ? (
          <>
            <Fineprint>
              Each narative slide is represented by a square below.
              Click to switch to a particular slide for editing.
            </Fineprint>
            {this.chooseNarrativeSlide()}
          </>
        ) : (
          <Fineprint>No narrative loaded yet!</Fineprint>
        )}
        <Hr/>
      </Container>
    );
  }
}

export default Summary;

