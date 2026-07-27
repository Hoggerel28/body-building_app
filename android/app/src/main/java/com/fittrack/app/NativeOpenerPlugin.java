package com.fittrack.app;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@CapacitorPlugin(name = "NativeOpener")
public class NativeOpenerPlugin extends Plugin {

    @PluginMethod
    public void open(PluginCall call) {
        String url = call.getString("url", "");
        String platform = call.getString("platform", "");
        JSObject result = new JSObject();

        if (!isHttpUrl(url)) {
            result.put("opened", false);
            call.resolve(result);
            return;
        }

        for (Target target : targetsFor(platform, url)) {
            for (String targetUrl : urlsFor(target, url)) {
                if (openTarget(targetUrl, target.packageName)) {
                    result.put("opened", true);
                    result.put("packageName", target.packageName);
                    call.resolve(result);
                    return;
                }
            }
        }

        result.put("opened", false);
        call.resolve(result);
    }

    private boolean openTarget(String url, String packageName) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            intent.setPackage(packageName);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(intent);
            return true;
        } catch (ActivityNotFoundException | SecurityException error) {
            return false;
        }
    }

    private List<Target> targetsFor(String platform, String url) {
        String text = (platform + " " + url).toLowerCase(Locale.ROOT);
        List<Target> targets = new ArrayList<>();
        if (text.contains("163.com")) targets.add(new Target("netease", "com.netease.cloudmusic"));
        if (text.contains("qq") || text.contains("y.qq.com")) targets.add(new Target("qq", "com.tencent.qqmusic"));
        if (text.contains("kuwo")) targets.add(new Target("kuwo", "cn.kuwo.player"));
        if (text.contains("kugou")) targets.add(new Target("kugou", "com.kugou.android"));
        if (text.contains("luna") || text.contains("qishui")) targets.add(new Target("qishui", "com.luna.music"));
        if (targets.isEmpty()) {
            targets.add(new Target("netease", "com.netease.cloudmusic"));
            targets.add(new Target("qq", "com.tencent.qqmusic"));
            targets.add(new Target("kuwo", "cn.kuwo.player"));
            targets.add(new Target("kugou", "com.kugou.android"));
            targets.add(new Target("qishui", "com.luna.music"));
        }
        return targets;
    }

    private List<String> urlsFor(Target target, String originalUrl) {
        List<String> urls = new ArrayList<>();
        urls.add(originalUrl);
        if ("netease".equals(target.type)) {
            String id = firstMatch(originalUrl, "(?:playlist\\?id=|[?&]id=)(\\d+)");
            if (!id.isEmpty()) urls.add("orpheus://playlist?id=" + id);
        }
        return urls;
    }

    private String firstMatch(String text, String pattern) {
        Matcher matcher = Pattern.compile(pattern).matcher(text);
        return matcher.find() ? matcher.group(1) : "";
    }

    private boolean isHttpUrl(String url) {
        return url != null && (url.startsWith("https://") || url.startsWith("http://"));
    }

    private static class Target {
        final String type;
        final String packageName;

        Target(String type, String packageName) {
            this.type = type;
            this.packageName = packageName;
        }
    }
}
