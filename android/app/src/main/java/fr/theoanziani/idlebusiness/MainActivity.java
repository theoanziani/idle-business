package fr.theoanziani.idlebusiness;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.webkit.WebViewAssetLoader;

/* Le jeu est servi depuis les ressources de l'appli, sous une adresse https locale :
   la sauvegarde (localStorage) reste stable d'une version à l'autre. */
public class MainActivity extends Activity {
  private WebView web;
  private static final String URL = "https://appassets.androidplatform.net/assets/www/index.html";

  @Override protected void onCreate(Bundle b) {
    super.onCreate(b);
    final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
      .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
    web = new WebView(this);
    WebSettings s = web.getSettings();
    s.setJavaScriptEnabled(true);
    s.setDomStorageEnabled(true);
    s.setDatabaseEnabled(true);
    s.setTextZoom(100);
    web.setWebViewClient(new WebViewClient() {
      @Override public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) { return loader.shouldInterceptRequest(r.getUrl()); }
      @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
        Uri u = r.getUrl(); if ("appassets.androidplatform.net".equals(u.getHost())) return false;
        startActivity(new android.content.Intent(android.content.Intent.ACTION_VIEW, u)); return true; }
    });
    setContentView(web);
    if (b != null) web.restoreState(b); else web.loadUrl(URL);
  }
  @Override protected void onSaveInstanceState(Bundle b) { super.onSaveInstanceState(b); web.saveState(b); }
  @Override public void onBackPressed() { if (web.canGoBack()) web.goBack(); else super.onBackPressed(); }
}
