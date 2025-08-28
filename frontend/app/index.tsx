import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  StatusBar,
  Text,
  ActivityIndicator,
  Platform,
  SafeAreaView
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';

const WEBSITE_URL = 'https://минутка96.рф/список-приложений/';
const TELEGRAM_URL = 'https://t.me/+c-W14SGdvFczMzZi';

// Enhanced dark theme CSS injection for the website
const DARK_THEME_CSS = `
  (function() {
    const style = document.createElement('style');
    style.innerHTML = \`
      * {
        background-color: #1a1a1a !important;
        color: #ffffff !important;
        border-color: #333333 !important;
      }
      
      body, html {
        background-color: #1a1a1a !important;
        color: #ffffff !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui !important;
      }
      
      div, span, p, h1, h2, h3, h4, h5, h6, li, td, th {
        background-color: transparent !important;
        color: #ffffff !important;
      }
      
      a {
        color: #87CEEB !important;
        text-decoration: underline !important;
      }
      
      a:hover {
        color: #B0E0E6 !important;
      }
      
      input, textarea, select, button {
        background-color: #2d2d2d !important;
        color: #ffffff !important;
        border: 1px solid #555555 !important;
        border-radius: 4px !important;
      }
      
      img {
        opacity: 0.85 !important;
        filter: brightness(0.85) contrast(1.1) !important;
      }
      
      .header, .nav, .menu, header, nav {
        background-color: #262626 !important;
        border-bottom: 1px solid #333333 !important;
      }
      
      .content, .main, .article, main, article {
        background-color: #1a1a1a !important;
        padding: 12px !important;
      }
      
      table {
        background-color: #1a1a1a !important;
        border: 1px solid #333333 !important;
      }
      
      tr:nth-child(even) {
        background-color: #262626 !important;
      }
      
      .sidebar, aside {
        background-color: #222222 !important;
      }
      
      /* Mobile optimizations */
      body {
        font-size: 16px !important;
        line-height: 1.6 !important;
      }
      
      /* Ensure text is readable */
      .white, .light {
        color: #ffffff !important;
      }
      
      .black, .dark {
        color: #cccccc !important;
      }
    \`;
    document.head.appendChild(style);
    
    // Re-apply dark theme after dynamic content loads
    setTimeout(() => {
      document.head.appendChild(style);
    }, 1000);
    
    setTimeout(() => {
      document.head.appendChild(style);
    }, 3000);
  })();
`;

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const webViewRef = useRef(null);

  const handleTelegramPress = async () => {
    try {
      const canOpen = await Linking.canOpenURL(TELEGRAM_URL);
      if (canOpen) {
        await Linking.openURL(TELEGRAM_URL);
      } else {
        Alert.alert(
          'Telegram не установлен',
          'Установите приложение Telegram для перехода к каналу',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening Telegram:', error);
      Alert.alert('Ошибка', 'Не удается открыть ссылку Telegram');
    }
  };

  const handleWebViewLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleWebViewError = () => {
    setLoading(false);
    setError(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="warning-outline" size={64} color="#87CEEB" />
      <Text style={styles.errorTitle}>Ошибка загрузки</Text>
      <Text style={styles.errorMessage}>
        Не удается загрузить сайт минутка96.рф
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
        <Text style={styles.retryButtonText}>Повторить</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Минутка96</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#87CEEB" />
        </TouchableOpacity>
      </View>

      {/* WebView Container */}
      <View style={styles.webViewContainer}>
        {error ? (
          renderError()
        ) : (
          <>
            <WebView
              ref={webViewRef}
              source={{ uri: WEBSITE_URL }}
              style={styles.webView}
              onLoad={handleWebViewLoad}
              onError={handleWebViewError}
              onLoadEnd={() => setLoading(false)}
              onLoadStart={() => setLoading(true)}
              injectedJavaScript={DARK_THEME_CSS}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              mixedContentMode="compatibility"
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('HTTP error:', nativeEvent);
              }}
              onNavigationStateChange={(navState) => {
                console.log('Navigation state changed:', navState.url);
              }}
              userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
            />
            
            {/* Loading Overlay */}
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#87CEEB" />
                <Text style={styles.loadingText}>Загрузка...</Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Floating Telegram Button */}
      <TouchableOpacity
        style={styles.telegramButton}
        onPress={handleTelegramPress}
        activeOpacity={0.8}
      >
        <Ionicons name="paper-plane" size={28} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    height: 56,
    backgroundColor: '#262626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  refreshButton: {
    padding: 8,
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 32,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    color: '#cccccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#87CEEB',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  telegramButton: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      default: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
});
