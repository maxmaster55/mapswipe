// @flow
import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isEmpty, isLoaded } from 'react-redux-firebase';
import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { getSqKmForZoomLevelPerTile } from '../../Database';
import LoadingIcon from '../LoadingIcon';
import LoadMoreCard from '../LoadMore';
import { EmptyTile, Tile } from './Tile';
import type {
    GroupMapType,
    NavigationProp,
} from '../../flow-types';

const GLOBAL = require('../../Globals');

const styles = StyleSheet.create({
    slide: {
        width: (GLOBAL.SCREEN_WIDTH),
        height: (GLOBAL.SCREEN_HEIGHT * GLOBAL.TILE_VIEW_HEIGHT),
        flex: 1,
        borderWidth: 0,
        backgroundColor: '#212121',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    tileRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        flex: 1,
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#0d1949',
        position: 'absolute',
        left: 0,
        bottom: 30,
    },
});

type CardToPushType = {
    cardX: number,
    tileRows: Array<Tile>,
    validTiles: number,
};

type ICProps = {
    card: Object,
    mapper: Object,
};

const IndividualCard = (props: ICProps) => {
    const rows = [];
    const { card, mapper } = props;
    card.tileRows.forEach((row) => {
        rows.unshift(<TileRow key={`${row.cardXStart}:${row.rowYStart}`} mapper={mapper} row={row.tiles} />);
    });

    return (
        <View style={styles.slide}>
            {rows}
        </View>
    );
};

type TRProps = {
    mapper: Object,
    row: Array<Tile>,
};

const TileRow = (props: TRProps) => {
    const rows = [];
    const { mapper, row } = props;
    row.forEach((tile) => {
        // inserts empty tiles so that they are always rendered at
        // the same X coordinate on the grid.
        if (tile !== undefined) {
            if (tile === 'emptytile') {
                rows.push(<EmptyTile key={Math.random()} />);
            } else {
                rows.push(<Tile tile={tile} key={tile.id} mapper={mapper} />);
            }
        }
    });
    return (
        <View style={styles.tileRow}>
            {rows}
        </View>
    );
};

type Props = {
    group: GroupMapType,
    mapper: Object,
    navigation: NavigationProp,
    projectId: number,
};

type State = {
    cardsInView: Array<CardToPushType>,
    marginXOffset: number,
};

class _CardBody extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.lastMode = ''; // 0 is online mapping, 1 is offline mapping
        this.currentXRenderOffset = 0; // aka the last state
        this.lastState = -1;

        this.state = {
            cardsInView: [],
            marginXOffset: 0,
        };
    }

    componentDidUpdate = (prevProps) => {
        const { group, mapper } = this.props;
        if (prevProps.group !== group) {
            if (isLoaded(group) && !isEmpty(group)) {
                this.generateCards();
                mapper.progress.updateProgress(0);
                if (this.scrollView) {
                    this.scrollView.scrollTo({ x: 0, animated: false });
                }
            }
        }
    }

    generateCards = () => {
        const { group } = this.props;
        const groupId = Object.keys(group)[0];
        const data = group[groupId];
        const tilesPerRow = GLOBAL.TILES_PER_VIEW_X;
        const cards = [];

        // iterate over all the tasksI with an interval of the tilesPerRow variable
        const minX = parseFloat(data.xMin);
        const maxX = parseFloat(data.xMax);
        for (let cardX = minX; cardX < maxX; cardX += tilesPerRow) {
            const cardToPush: CardToPushType = {
                cardX,
                tileRows: [],
                validTiles: 0,
            };

            // iterate over Y once and place all X tiles for this Y coordinate in the tile cache.
            for (let tileY = parseFloat(data.yMax); tileY >= parseFloat(data.yMin); tileY -= 1) {
                const tileRowObject = {
                    rowYStart: tileY,
                    rowYEnd: tileY,
                    cardXStart: cardX,
                    cardXEnd: cardX,
                    tiles: [],
                };
                const tileMinX = parseFloat(cardX);
                const tileMaxX = tileMinX + tilesPerRow;
                for (let tileX = parseFloat(cardX); tileX < tileMaxX; tileX += 1) {
                    if (data.tasks[`${data.zoomLevel}-${tileX}-${tileY}`] !== undefined) {
                        cardToPush.validTiles += 1;
                    }
                    tileRowObject.tiles.push(
                        data.tasks[`${data.zoomLevel}-${tileX}-${tileY}`] === undefined ? 'emptytile' : data.tasks[`${data.zoomLevel}-${tileX}-${tileY}`],
                    );

                    if (tileY > tileRowObject.rowYEnd) {
                        tileRowObject.rowYEnd = tileY;
                    }
                    if (tileX > tileRowObject.cardXEnd) {
                        tileRowObject.cardXEnd = tileX;
                    }
                }
                cardToPush.tileRows.push(tileRowObject);
            }
            if (cardToPush.validTiles > 0) { // ensure the card has tiles
                cards.push(cardToPush);
            }
        }
        this.setState({
            cardsInView: cards,
        });
    }

    getContributions = (group, results) => {
        const contributionsCount = Object.keys(results).length;
        const addedDistance = group.count * getSqKmForZoomLevelPerTile(group.zoomLevel);
        return { contributionsCount, addedDistance };
    }

    toNextGroup = () => {
        const { navigation } = this.props;
        navigation.navigate('Mapper');
    }

    handleScroll = (event: Object) => {
        const { x } = event.nativeEvent.contentOffset;
        const { cardsInView } = this.state;
        const { mapper } = this.props;
        let progress = 0;
        if (cardsInView.length > 0) {
            progress = x / (GLOBAL.SCREEN_WIDTH * cardsInView.length);
        }
        mapper.progress.updateProgress(progress);
    }

    currentXRenderOffset: number;

    lastMode: string;

    lastState: number;

    scrollView: ?ScrollView;

    showingLoader: boolean;

    render() {
        const rows = [];
        const { cardsInView, marginXOffset } = this.state;
        const {
            group,
            mapper,
            navigation,
            projectId,
        } = this.props;
        if (cardsInView.length > 0) {
            let lastCard = null;

            cardsInView.forEach((card) => {
                lastCard = card;
                rows.push(<IndividualCard key={card.cardX} card={card} mapper={mapper} />);
            });

            rows.push(<LoadMoreCard
                key={lastCard ? lastCard.id / 2 : 0}
                getContributions={this.getContributions}
                group={group[Object.keys(group)[0]]}
                navigation={navigation}
                projectId={projectId}
                toNextGroup={this.toNextGroup}
            />); // lastCard.id/2 is random so that it never is the same number
        } else {
            this.showingLoader = true;
            rows.push(<LoadingIcon key="loadingicon" />);
        }

        return (
            <ScrollView
                onScroll={this.handleScroll}
                automaticallyAdjustContentInsets={false}
                horizontal
                ref={(r) => { this.scrollView = r; }}
                pagingEnabled
                removeClippedSubviews
                contentContainerStyle={[styles.wrapper, { paddingHorizontal: marginXOffset }]}
            >
                {rows}
            </ScrollView>
        );
    }
}

const mapStateToProps = (state, ownProps) => (
    {
        group: state.firebase.data.group,
        mapper: ownProps.mapper,
        navigation: ownProps.navigation,
        projectId: ownProps.projectId,
    }
);

export default compose(
    firebaseConnect(props => [
        {
            path: `groups/${props.projectId}`,
            queryParams: ['limitToFirst=1', 'orderByChild=completedCount'],
            storeAs: 'group',
        },
    ]),
    connect(
        mapStateToProps,
    ),
)(_CardBody);
