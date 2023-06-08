const WalkthroughAppConfig = {
  onboardingConfig: {
    walkthroughScreens: [
      {
        icon: require('../assets/walkthrough/myAssist.png'),
        title: 'Welcome to MyAssist',
        description:
          'MyAssist is your own personal assistant that helps you answer questions and get things done.',
      },
      {
        icon: require('../assets/walkthrough/voiceRecorder.png'),
        title: 'Send Voice Commands',
        description: 'MyAssist allows you to send voice commands to your assistant.',
      },
      {
        icon: require('../assets/walkthrough/location.png'),
        title: 'Get Location Based Information',
        description: 'MyAssist will provide you with location based information, if you request anything related to your location.',
      },
    ],
  },
};

export default WalkthroughAppConfig;
