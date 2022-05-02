import ahk
import argparse
import http.server
import socketserver

flags_parser = argparse.ArgumentParser()
flags_parser.add_argument('--port', 
                          dest = 'port',
                          default = 12345,
                          help = 'Port to start the server')
flags = flags_parser.parse_args()

class HandleRequests(http.server.BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

    def do_GET(self):
        self._set_headers()
        self.wfile.write(b'received get request')
        
    def do_POST(self):
        self._set_headers()
        content_len = int(self.headers.getheader('content-length', 0))
        post_body = self.rfile.read(content_len)
        self.wfile.write(b'received post request:<br>{}'.format(post_body))

def run(server_class=http.server.HTTPServer, handler_class=HandleRequests):
    server_address = ('', flags.port)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()
    
def main():
    print('Start the server at port: %s' % flags.port)

    run()

main()
