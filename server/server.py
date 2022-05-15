from ahk import AHK
import argparse
import http.server
import json
import os
import socketserver
import time
import shutil

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
        folder_path = payload["folderPath"]        
        exists = False
        if os.path.exists(folder_path):
            exists = True
            shutil.rmtree(folder_path)

        os.mkdir(folder_path)
        self._write({
            "created" : folder_path,
            "deleteExist" : exists
        })
    
    def _print_page(self, payload):
        folder_path = payload["folderPath"]
        file_name = payload["fileName"]
        full_path = payload["fullPath"]
        
        time.sleep(1)
        if os.path.exists(full_path):
            ahk.send("{Esc}")

            self._write({
                "exists" : full_path
            })
            return
        
        ahk.send("{Enter}") # save from chrome print preview

        time.sleep(1)
        win = ahk.find_window(title = b'\xe5\x8f\xa6\xe5\xad\x98\xe4\xb8\xba') # 另存为

        while win == None:
            print("Can not find SaveAs window, sleep 1s, for %s" % file_name)
            time.sleep(1)
            win = ahk.find_window(title = b'\xe5\x8f\xa6\xe5\xad\x98\xe4\xb8\xba') # 另存为

        win.send(file_name)

        (x, y) = win.position
        ahk.mouse_move(x + 180, y + 65) # closer to address line
        ahk.click()

        time.sleep(0.5)
        ahk.send(folder_path)
        ahk.send("{Enter}")

        ahk.send("!s") # Alt+s again to really save

        self._write({
            "saved" : full_path
        })
        return


def run(server_class=http.server.HTTPServer, handler_class=HandleRequests):
    server_address = ('', flags.port)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()
    
def main():
    print('Start the server at port: %s' % flags.port)

    run()

main()
