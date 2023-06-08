import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {StyleSheet, ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';

// adapted from: https://stackoverflow.com/a/49310105/4488853
class Tweet extends Component {
  static propTypes = {
    tweetUrl: PropTypes.string,
  };

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      embedHtml: null,
    };
  }

  componentDidMount() {
    this.setupEmbed();
  }

  setupEmbed() {
    // pass in the Twitter Web URL
    let tweetUrl =
      'https://publish.twitter.com/oembed?url=' +
      // @ts-ignore
      encodeURIComponent(this.props.tweetUrl);
    fetch(tweetUrl, {
      method: 'GET',
      headers: {Accepts: 'application/json'},
    }).then(resp => {
      resp.json().then(json => {
        let html = json.html;
        this.setState({
          embedHtml: html,
        });
      });
    });
  }

  renderEmbed() {
    // @ts-ignore
    if (this.state.embedHtml) {
      // @ts-ignore
      let tempVar = this.state.embedHtml;
      let html = `<!DOCTYPE html>\
      <html>\
        <head>\
          <meta charset="utf-8">\
          <meta name="viewport" content="width=device-width, initial-scale=1.0">\
          </head>\
          <body>\
            ${tempVar}\
          </body>\
      </html>`;
      return (
        <View style={styles.webviewWrap}>
          <WebView source={{html: html}} style={styles.webview} />
        </View>
      );
    }
  }

  render() {
    return (
      // @ts-ignore
      <ScrollView style={{height: this.props.height || 800}}>
        {this.renderEmbed()}
      </ScrollView>
    );
  }
}

export default Tweet;

const styles = StyleSheet.create({
  webviewWrap: {
    flex: 1,
  },
  webview: {
    flex: 1,
    width: 300,
    height: 200, // height is hard to control
  },
});
