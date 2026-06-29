# https://www.geeksforgeeks.org/python/launch-an-http-server-with-a-single-line-of-python-code/

import http.server
import socketserver

PORT = 3000
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        print(f"Dev server started at http://localhost:{PORT}")
        print("Press Ctrl+C to exit\n")
        print(f"Serveur de développement démarré sur http://localhost:{PORT}")
        print("Appuyez Ctrl+C pour quitter")
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nExiting...")
