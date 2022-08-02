package com.ruixi.ioe.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.*;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.conn.ssl.X509HostnameVerifier;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.CoreConnectionPNames;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

import javax.net.ssl.*;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.*;

/**
 * 封装了一些采用HttpClient发送HTTP请求的方法
 *  本工具所采用的是最新的HttpComponents-Client-4.2.1
 *  关于本工具类中的一些解释说明,可参考下方列出的我的三篇文章
 *  http://blog.csdn.net/jadyer/article/details/7615830
 *  http://blog.csdn.net/jadyer/article/details/7615880
 *  http://blog.csdn.net/jadyer/article/details/7802139
 * @create Feb 1, 2012 3:02:27 PM
 * @update Oct 8, 2012 3:48:55 PM
 * @version v1.3
 * @history v1.0-->新建<code>sendGetRequest(String,String)</code>和<code>sendPostRequest(String,Map<String,String>,String,String)</code>方法
 * @history v1.1-->新增<code>sendPostSSLRequest(String,Map<String,String>,String,String)</code>方法,用于发送HTTPS的POST请求
 * @history v1.2-->新增<code>sendPostRequest(String,String,boolean,String,String)</code>方法,用于发送HTTP协议报文体为任意字符串的POST请求
 * @history v1.3-->新增<code>java.net.HttpURLConnection</code>实现的<code>sendPostRequestByJava()</code>方法
 */
@Slf4j
public class HttpClientUtils {
    private HttpClientUtils(){}
    /**
     * 发送HTTP_GET请求
     * * 该方法会自动关闭连接,释放资源
     * @param reqURL    请求地址(含参数)
     * @param decodeCharset 解码字符集,解析响应数据时用之,其为null时默认采用UTF-8解码
     * @param seconds 超时秒数（单位：秒）
     * @return 远程主机响应正文
     */
    public static String sendGetRequest(String reqURL, String decodeCharset,int seconds){
//		long responseLength = 0;       //响应长度
        String responseContent = null; //响应内容
        HttpClient httpClient = new DefaultHttpClient(); //创建默认的httpClient实例
        httpClient.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, seconds * 1000);
        httpClient.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT,seconds * 1000);//数据传输时间
        HttpGet httpGet = new HttpGet(reqURL);           //创建org.apache.http.client.methods.HttpGet
        try{
            HttpResponse response = httpClient.execute(httpGet); //执行GET请求
            HttpEntity entity = response.getEntity();            //获取响应实体
            if(null != entity){
//				responseLength = entity.getContentLength();
                responseContent = EntityUtils.toString(entity, decodeCharset==null ? "UTF-8" : decodeCharset);
                EntityUtils.consume(entity); //Consume response content
            }
//			System.out.println("请求地址: " + httpGet.getURI());
//			System.out.println("响应状态: " + response.getStatusLine());
//			System.out.println("响应长度: " + responseLength);
//			System.out.println("响应内容: " + responseContent);
        }catch(ClientProtocolException e){
            log.error("该异常通常是协议错误导致,比如构造HttpGet对象时传入的协议不对(将'http'写成'htp')或者服务器端返回的内容不符合HTTP协议要求等,堆栈信息如下", e);
        }catch(ParseException e){
            log.error(e.getMessage(), e);
        }catch(IOException e){
            log.error("该异常通常是网络原因引起的,如HTTP服务器未启动等,堆栈信息如下", e);
        }finally{
            httpClient.getConnectionManager().shutdown(); //关闭连接,释放资源
        }
        return responseContent;
    }


    /**
     * 发送get请求
     * @param reqURL 请求地址
     * @param seconds 超时：秒
     * @return
     */
    public static String sendGetRequest(String reqURL,int seconds){
        return sendGetRequest(reqURL,null,seconds);
    }

    /**
     * 发送HTTP_POST请求
     * * 该方法为<code>sendPostRequest(String,String,boolean,String,String)</code>的简化方法
     * * 该方法在对请求数据的编码和响应数据的解码时,所采用的字符集均为UTF-8
     * * 当<code>isEncoder=true</code>时,其会自动对<code>sendData</code>中的[中文][|][ ]等特殊字符进行<code>URLEncoder.encode(string,"UTF-8")</code>
     * @param isEncoder 用于指明请求数据是否需要UTF-8编码,true为需要
     */
    public static String sendPostRequest(String reqURL, String sendData, boolean isEncoder){
        return sendPostRequest(reqURL, sendData, isEncoder, null, null);
    }


    /**
     * 发送HTTP_POST请求
     * * 该方法会自动关闭连接,释放资源
     * * 当<code>isEncoder=true</code>时,其会自动对<code>sendData</code>中的[中文][|][ ]等特殊字符进行<code>URLEncoder.encode(string,encodeCharset)</code>
     * @param reqURL        请求地址
     * @param sendData      请求参数,若有多个参数则应拼接成param11=value11¶m22=value22¶m33=value33的形式后,传入该参数中
     * @param isEncoder     请求数据是否需要encodeCharset编码,true为需要
     * @param encodeCharset 编码字符集,编码请求数据时用之,其为null时默认采用UTF-8解码
     * @param decodeCharset 解码字符集,解析响应数据时用之,其为null时默认采用UTF-8解码
     * @return 远程主机响应正文
     */
    public static String sendPostRequest(String reqURL, String sendData, boolean isEncoder, String encodeCharset, String decodeCharset){
        String responseContent = null;
        HttpClient httpClient = new DefaultHttpClient();

        HttpPost httpPost = new HttpPost(reqURL);
        //httpPost.setHeader(HTTP.CONTENT_TYPE, "application/x-www-form-urlencoded; charset=UTF-8");
        httpPost.setHeader(HTTP.CONTENT_TYPE, "application/x-www-form-urlencoded");
        try{
            if(isEncoder){
                List<NameValuePair> formParams = new ArrayList<NameValuePair>();
                for(String str : sendData.split("&")){
                    formParams.add(new BasicNameValuePair(str.substring(0,str.indexOf("=")), str.substring(str.indexOf("=")+1)));
                }
                httpPost.setEntity(new StringEntity(URLEncodedUtils.format(formParams, encodeCharset==null ? "UTF-8" : encodeCharset)));
            }else{
                httpPost.setEntity(new StringEntity(sendData));
            }

            HttpResponse response = httpClient.execute(httpPost);
            HttpEntity entity = response.getEntity();
            if (null != entity) {
                responseContent = EntityUtils.toString(entity, decodeCharset==null ? "UTF-8" : decodeCharset);
                EntityUtils.consume(entity);
            }
        }catch(Exception e){
            log.error("与[" + reqURL + "]通信过程中发生异常,堆栈信息如下", e);
        }finally{
            httpClient.getConnectionManager().shutdown();
        }
        return responseContent;
    }


    /**
     * 发送HTTP_POST请求
     * * 该方法会自动关闭连接,释放资源
     * * 该方法会自动对<code>params</code>中的[中文][|][ ]等特殊字符进行<code>URLEncoder.encode(string,encodeCharset)</code>
     * @param reqURL        请求地址
     * @param params        请求参数
     * @param encodeCharset 编码字符集,编码请求数据时用之,其为null时默认采用UTF-8解码
     * @param decodeCharset 解码字符集,解析响应数据时用之,其为null时默认采用UTF-8解码
     * @return 远程主机响应正文
     */
    public static String sendPostRequest(String reqURL, Map<String, String> params, String encodeCharset, String decodeCharset,int timeOut){
        log.info("请求接口地址："+reqURL);

        String responseContent = null;
        HttpClient httpClient = new DefaultHttpClient();

        X509TrustManager xtm = new X509TrustManager(){
            @Override
            public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {}
            @Override
            public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {}
            @Override
            public X509Certificate[] getAcceptedIssuers() {return null;}
        };
        //这个好像是HOST验证
        X509HostnameVerifier hostnameVerifier = new X509HostnameVerifier() {
            @Override
            public boolean verify(String arg0, SSLSession arg1) {
                return true;
            }
            @Override
            public void verify(String arg0, SSLSocket arg1) throws IOException {}
            @Override
            public void verify(String arg0, String[] arg1, String[] arg2) throws SSLException {}
            @Override
            public void verify(String arg0, X509Certificate arg1) throws SSLException {}
        };
        try {
            //TLS1.0与SSL3.0基本上没有太大的差别，可粗略理解为TLS是SSL的继承者，但它们使用的是相同的SSLContext
            SSLContext ctx = SSLContext.getInstance("TLS");
            //使用TrustManager来初始化该上下文，TrustManager只是被SSL的Socket所使用
            ctx.init(null, new TrustManager[] { xtm }, null);
            //创建SSLSocketFactory
            SSLSocketFactory socketFactory = new SSLSocketFactory(ctx);
            socketFactory.setHostnameVerifier(hostnameVerifier);
            //通过SchemeRegistry将SSLSocketFactory注册到我们的HttpClient上
            httpClient.getConnectionManager().getSchemeRegistry().register(new Scheme("https", socketFactory, 443));
            log.info("忽略HTTPS验证...");
        } catch (KeyManagementException e1) {
            log.info("忽略HTTPS验证异常！");
        } catch (NoSuchAlgorithmException e1) {
            log.info("忽略HTTPS验证异常！");
        }

        httpClient.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, timeOut * 1000);
        httpClient.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT, timeOut * 1000);//数据传输时间
        HttpPost httpPost = new HttpPost(reqURL);
        List<NameValuePair> formParams = new ArrayList<NameValuePair>(); //创建参数队列
        for(Map.Entry<String,String> entry : params.entrySet()){
            formParams.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
        }
        try{
            httpPost.setEntity(new UrlEncodedFormEntity(formParams, encodeCharset==null ? "UTF-8" : encodeCharset));

            HttpResponse response = httpClient.execute(httpPost);
            HttpEntity entity = response.getEntity();
            if (null != entity) {
                responseContent = EntityUtils.toString(entity, decodeCharset==null ? "UTF-8" : decodeCharset);
                EntityUtils.consume(entity);
            }
            log.debug("接口返回数据："+responseContent);
        }catch(Exception e){
            log.error("与[" + reqURL + "]通信过程中发生异常,堆栈信息如下", e);
        }finally{
            httpClient.getConnectionManager().shutdown();
        }
        return responseContent;
    }

    public static String sendPostRequest(String reqURL,Map<String, String> params){
        return sendPostRequest(reqURL,params,null,null,6);
    }

    public static String sendPostRequest(String reqURL,Map<String, String> params,int timeOut){
        return sendPostRequest(reqURL,params,null,null,timeOut);
    }

    public static String sendPostRequest(String reqURL,Map<String, String> params,File file, int timeOut){
        return sendPostRequestCanFile(reqURL,params,null,null,file,timeOut);
    }

    /**
     * 发送HTTPS_POST请求
     * * 该方法为<code>sendPostSSLRequest(String,Map<String,String>,String,String)</code>方法的简化方法
     * * 该方法在对请求数据的编码和响应数据的解码时,所采用的字符集均为UTF-8
     * * 该方法会自动对<code>params</code>中的[中文][|][ ]等特殊字符进行<code>URLEncoder.encode(string,"UTF-8")</code>
     */
    public static String sendPostSSLRequest(String reqURL, Map<String, String> params){
        return sendPostSSLRequest(reqURL, params, null, null);
    }


    /**
     * 发送HTTPS_POST请求
     * * 该方法会自动关闭连接,释放资源
     * * 该方法会自动对<code>params</code>中的[中文][|][ ]等特殊字符进行<code>URLEncoder.encode(string,encodeCharset)</code>
     * @param reqURL        请求地址
     * @param params        请求参数
     * @param encodeCharset 编码字符集,编码请求数据时用之,其为null时默认采用UTF-8解码
     * @param decodeCharset 解码字符集,解析响应数据时用之,其为null时默认采用UTF-8解码
     * @return 远程主机响应正文
     */
    public static String sendPostSSLRequest(String reqURL, Map<String, String> params, String encodeCharset, String decodeCharset){
        String responseContent = "";
        HttpClient httpClient = new DefaultHttpClient();
        X509TrustManager xtm = new X509TrustManager(){
            @Override
            public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {}
            @Override
            public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {}
            @Override
            public X509Certificate[] getAcceptedIssuers() {return null;}
        };
        try {
            SSLContext ctx = SSLContext.getInstance("TLS");
            ctx.init(null, new TrustManager[]{xtm}, null);
            SSLSocketFactory socketFactory = new SSLSocketFactory(ctx);
            httpClient.getConnectionManager().getSchemeRegistry().register(new Scheme("https", 443, socketFactory));

            HttpPost httpPost = new HttpPost(reqURL);
            List<NameValuePair> formParams = new ArrayList<NameValuePair>();
            for(Map.Entry<String,String> entry : params.entrySet()){
                formParams.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
            }
            httpPost.setEntity(new UrlEncodedFormEntity(formParams, encodeCharset==null ? "UTF-8" : encodeCharset));

            HttpResponse response = httpClient.execute(httpPost);
            HttpEntity entity = response.getEntity();
            if (null != entity) {
                responseContent = EntityUtils.toString(entity, decodeCharset==null ? "UTF-8" : decodeCharset);
                EntityUtils.consume(entity);
            }
        } catch (Exception e) {
            log.error("与[" + reqURL + "]通信过程中发生异常,堆栈信息为", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        return responseContent;
    }


    /**
     * 发送HTTP_POST请求
     * * 若发送的<code>params</code>中含有中文,记得按照双方约定的字符集将中文<code>URLEncoder.encode(string,encodeCharset)</code>
     * * 本方法默认的连接超时时间为30秒,默认的读取超时时间为30秒
     * @param reqURL 请求地址
     * @param params 发送到远程主机的正文数据,其数据类型为<code>java.util.Map<String, String></code>
     * @return 远程主机响应正文`HTTP状态码,如<code>"SUCCESS`200"</code><br>若通信过程中发生异常则返回"Failed`HTTP状态码",如<code>"Failed`500"</code>
     */
    public static String sendPostRequestByJava(String reqURL, Map<String, String> params){
        StringBuilder sendData = new StringBuilder();
        for(Map.Entry<String, String> entry : params.entrySet()){
            sendData.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
        }
        if(sendData.length() > 0){
            sendData.setLength(sendData.length() - 1); //删除最后一个&符号
        }
        return sendPostRequestByJava(reqURL, sendData.toString());
    }


    /**
     * 发送HTTP_POST请求
     * * 若发送的<code>sendData</code>中含有中文,记得按照双方约定的字符集将中文<code>URLEncoder.encode(string,encodeCharset)</code>
     * * 本方法默认的连接超时时间为30秒,默认的读取超时时间为30秒
     * @param reqURL   请求地址
     * @param sendData 发送到远程主机的正文数据
     * @return 远程主机响应正文`HTTP状态码,如<code>"SUCCESS`200"</code><br>若通信过程中发生异常则返回"Failed`HTTP状态码",如<code>"Failed`500"</code>
     */
    public static String sendPostRequestByJava(String reqURL, String sendData){
        HttpURLConnection httpURLConnection = null;
        OutputStream out = null; //写
        InputStream in = null;   //读
        int httpStatusCode = 0;  //远程主机响应的HTTP状态码
        try{
            URL sendUrl = new URL(reqURL);
            httpURLConnection = (HttpURLConnection)sendUrl.openConnection();
            httpURLConnection.setRequestMethod("POST");
            httpURLConnection.setDoOutput(true);        //指示应用程序要将数据写入URL连接,其值默认为false
            httpURLConnection.setUseCaches(false);
            httpURLConnection.setConnectTimeout(6*1000); //6秒连接超时
            httpURLConnection.setReadTimeout(6*1000);    //6秒读取超时

            out = httpURLConnection.getOutputStream();
            out.write(sendData.toString().getBytes());

            //清空缓冲区,发送数据
            out.flush();

            //获取HTTP状态码
            httpStatusCode = httpURLConnection.getResponseCode();

            //该方法只能获取到[HTTP/1.0 200 OK]中的[OK]
            //若对方响应的正文放在了返回报文的最后一行,则该方法获取不到正文,而只能获取到[OK],稍显遗憾
            //respData = httpURLConnection.getResponseMessage();

//			//处理返回结果
//			BufferedReader br = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()));
//			String row = null;
//			String respData = "";
//			if((row=br.readLine()) != null){ //readLine()方法在读到换行[\n]或回车[\r]时,即认为该行已终止
//				respData = row;              //HTTP协议POST方式的最后一行数据为正文数据
//			}
//			br.close();

            in = httpURLConnection.getInputStream();
            byte[] byteDatas = new byte[in.available()];
            in.read(byteDatas);
            return new String(byteDatas);
        }catch(Exception e){
            log.error(e.getMessage()+"httpStatus:"+httpStatusCode);
            return "Failed";
        }finally{
            if(out != null){
                try{
                    out.close();
                }catch (Exception e){
                    log.error("关闭输出流时发生异常,堆栈信息如下", e);
                }
            }
            if(in != null){
                try{
                    in.close();
                }catch(Exception e){
                    log.error("关闭输入流时发生异常,堆栈信息如下", e);
                }
            }
            if(httpURLConnection != null){
                httpURLConnection.disconnect();
                httpURLConnection = null;
            }
        }
    }

    /**
     *
     * @param reqURL 请求url
     * @param params 请求参数Map<String,String>
     * @param encodeCharset
     * @param decodeCharset
     * @param file
     * @param timeOut
     * @return
     */
    public static String sendPostRequestCanFile(String reqURL, Map<String,String> params,
                                                String encodeCharset, String decodeCharset, File file, int timeOut){
        log.debug("请求接口地址："+reqURL);

        String responseContent = null;
        HttpClient httpClient = HttpClients.createDefault();
        //设置请求和传输超时时间
        RequestConfig requestConfig = RequestConfig.custom()
                .setSocketTimeout(1000 * timeOut)
                .setConnectTimeout(1000 * timeOut).build();
//		MultipartEntity reqEntity = new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE,
//	               null, Charset.forName(HTTP.UTF_8));
        MultipartEntity reqEntity = new MultipartEntity();
        try {
            HttpPost httpPost = new HttpPost(reqURL);
            httpPost.setConfig(requestConfig);
            // 封装File类型参数
            FileBody body = new FileBody(file);
            reqEntity.addPart("imgfile", body);
            // 封装普通文本类型参数
            for(Map.Entry<String,String> entry : params.entrySet()){
                reqEntity.addPart(entry.getKey(),new StringBody(entry.getValue(),Charset.forName("UTF-8")));
            }
            httpPost.setEntity(reqEntity);
            // 执行post请求
            HttpResponse response = httpClient.execute(httpPost);
            HttpEntity entity = response.getEntity();
            if (null != entity) {
                responseContent = EntityUtils.toString(entity, decodeCharset==null ? "UTF-8" : decodeCharset);
                EntityUtils.consume(entity);
            }
        } catch (ParseException e) {
            log.error(e.getMessage(), e);
            log.error(e.getMessage());
        } catch (IOException e) {
            log.error("该异常通常是网络原因引起的,如HTTP服务器未启动等,堆栈信息如下", e);
            log.error(e.getMessage());
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        return responseContent;
    }

    /**
     *
     * 包含请求头部的信息 获取原始数据时用到
     * @author baishengcai
     * @param url 路径
     * @param headers  头信息
     * @param jsonStr json格式的参数
     */
    public static String postWithHeader(String url,Map<String, String> headers,String  jsonStr){
        HttpPost httpPost  = new HttpPost(url);
        if (headers != null) {
            Set<String> keys = headers.keySet();
            for (Iterator<String> i = keys.iterator(); i.hasNext();) {
                String key = (String) i.next();
                httpPost.addHeader(key, headers.get(key));
            }
        }

        StringEntity s = new StringEntity(jsonStr, ContentType.create("application/json", "UTF-8"));
        DefaultHttpClient httpclient = new DefaultHttpClient();
        httpclient.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 30000);
        httpPost.setEntity(s);
        String body = null;
        try {
            body = invoke(httpclient, httpPost);
            //  body = new String(body.getBytes("ISO-8859-1"), "UTF-8");
        } catch (Exception e) {
            if(log.isErrorEnabled()){
                log.error("@@@HttpConnectionUtil发送postWithHeader请求：URL=【"+url+"】;headers=【"+JsonUtil.toJson(headers)+"】;jsonStr=【"+jsonStr+"】异常信息：",e);
            }
        }finally{
            httpclient.getConnectionManager().shutdown();
        }
        return body;
    }

    /**
     * 发送HTTP_POST请求,json格式数据
     * @param url
     * @param body
     * @return
     * @throws Exception
     */
    public static String sendPostByJson(String url, String body) throws Exception {
        CloseableHttpClient httpclient = HttpClients.custom().build();
        HttpPost post = null;
        String resData = null;
        CloseableHttpResponse result = null;
        try {
            post = new HttpPost(url);
            HttpEntity entity2 = new StringEntity(body, Consts.UTF_8);
            post.setConfig(RequestConfig.custom().setConnectTimeout(3000).setSocketTimeout(3000).build());
            post.setHeader("Content-Type", "application/json");
            post.setEntity(entity2);
            result = httpclient.execute(post);
            if (HttpStatus.SC_OK == result.getStatusLine().getStatusCode()) {
                resData = EntityUtils.toString(result.getEntity(),"UTF-8");
            }
        } finally {
            if (result != null) {
                result.close();
            }
            if (post != null) {
                post.releaseConnection();
            }
            httpclient.close();
        }
        return resData;
    }

    private static String invoke(DefaultHttpClient httpclient, HttpUriRequest httpost) throws Exception {
        HttpResponse response = sendRequest(httpclient, httpost);

        String body = paseResponse(response);
        return body;
    }

    private static String paseResponse(HttpResponse response) {
        String body = null;
        if (null == response) {
            return body;
        }
        HttpEntity entity = response.getEntity();
        try {
            body = EntityUtils.toString(entity);
//			body = new String(body.getBytes("ISO-8859-1"), "UTF-8");
        } catch (ParseException e) {
            if(log.isErrorEnabled()){
                log.error("paseResponse  ParseException ", e);
            }
        } catch (IOException e) {
            if(log.isErrorEnabled()){
                log.error("paseResponse IOException", e);
            }
        }
        return body;
    }
    private static HttpResponse sendRequest(DefaultHttpClient httpclient, HttpUriRequest httpost) throws ClientProtocolException, IOException {
        return	 httpclient.execute(httpost);
    }
}
