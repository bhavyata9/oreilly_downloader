from ahk import AHK
import argparse
import http.server
import json
import os
import socketserver

flags_parser = argparse.ArgumentParser()
flags_parser.add_argument('--port', 
                          dest = 'port',
                          default = 12345,
                          help = 'Port to start the server')
flags = flags_parser.parse_args()

ahk = AHK()

class HandleRequests(http.server.BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")    
        self.end_headers()    

    def do_GET(self):
        self._set_headers()
        self.wfile.write(b'received get request')
        
    def do_POST(self):
        self._set_headers()
        content_len = int(self.headers.get('Content-Length'))
        post_body = self.rfile.read(content_len)

        print('Get request: %s' % post_body)

        message = json.loads(post_body)

        if message["method"] == "CreateFolder":
            self._create_folder(message["payload"])
        elif message["method"] == "PrintPage":
            self._print_page(message["payload"])
        else:
            self._write({
                "error" : "unknown method",
                "body" : post_body
            })

    def _write(self, obj):
        self.wfile.write(str.encode(json.dumps(obj)))

    def _create_folder(self, payload):
        folder_path = payload["folder"]
        if not os.path.exists(folder_path):
            os.mkdir(folder_path)
            self._write({
                "created" : folder_path
            })
        else:
            self._write({
                "exists" : folder_path
            })
    
    def _print_page(self, payload):
        file_path = payload["file"]
        
        ahk.key_down('Esc')
        ahk.key_up('Esc')

        self._write({
            "exists" : file_path
        })



def run(server_class=http.server.HTTPServer, handler_class=HandleRequests):
    server_address = ('', flags.port)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()
    
def main():
    print('Start the server at port: %s' % flags.port)

    run()

main()
