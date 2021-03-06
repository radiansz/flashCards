import React from 'react';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';
import withStorageData from 'shared/containers/withStorageData';
import { getCardsFromDeck, deleteCard } from 'shared/storage/storageActions';
import { makeNewCardScreen, makeEditCardScreen } from 'shared/navigation';
import Cards from '../components/Cards';

class DeckCardsContainer extends React.Component {
  static propTypes = {
    loaded: PropTypes.bool.isRequired,
    deckId: PropTypes.number.isRequired,
    componentId: PropTypes.string.isRequired,
    parentComponentId: PropTypes.string.isRequired,
    updateData: PropTypes.func.isRequired,
    storage: PropTypes.shape({
      performAction: PropTypes.func.isRequired,
    }).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({})),
  }

  constructor(props) {
    super(props);

    this.navigationSubscription = Navigation.events().registerNavigationButtonPressedListener(
      this.navigationButtonPressed,
    );
  }

  componentWillUnmount() {
    this.navigationSubscription.remove();
  }

  navigationButtonPressed = ({ buttonId }) => {
    if (buttonId === 'addCardButton') {
      this.addCard();
    }
  }

  addCard = () => {
    const { deckId, componentId, parentComponentId } = this.props;

    Navigation.push(parentComponentId || componentId, makeNewCardScreen(deckId));
  }

  removeCard = (cardId) => {
    const { updateData, storage } = this.props;

    storage.performAction(deleteCard(cardId));

    updateData();
  }

  editCard = (cardId) => {
    const { componentId, parentComponentId } = this.props;

    Navigation.push(parentComponentId || componentId, makeEditCardScreen(cardId));
  }

  render() {
    const { data, loaded } = this.props;

    return (
      <Cards
        loaded={loaded}
        data={data}
        addCard={this.addCard}
        removeCard={this.removeCard}
        editCard={this.editCard}
      />
    );
  }
}

export default withStorageData(
  ({ deckId }) => getCardsFromDeck(deckId),
)(DeckCardsContainer);
