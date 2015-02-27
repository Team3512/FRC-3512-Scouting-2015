package main;

import "dispatcher"
import "net/http"
import _ "github.com/mattn/go-sqlite3"
import "database/sql"
import "log"
/* import "time" */
import "fmt"
import "bytes"

type ReceiveMessageHandle struct {
  database *sql.DB;
};

func (wh ReceiveMessageHandle) ServeHTTP(wr http.ResponseWriter, req *http.Request) {
  /* message = req.FormValue("message");
  from = req.FormValue("from");
  to = req.FormValue("to");
  timestamp = time.Now(); */

  buf := new(bytes.Buffer);
  buf.ReadFrom(req.Body);
  s := buf.String();
  fmt.Println(s);

  wr.WriteHeader(200);
  wr.Header().Add("Content-Type", "text/html");
  fmt.Fprintln(wr, "OK");
}

func formHandle(wr http.ResponseWriter, req *http.Request) {
    http.ServeFile(wr, req, "html/scouting-form.html");
}

func main() {
  var d *dispatcher.Dispatcher;

  /* Initialize the database */
  db, err := sql.Open("sqlite3", "scouting.db");
  if(err != nil) {
    log.Fatal(err);
  }
  defer db.Close();

  msgHandle := new(ReceiveMessageHandle);
  /* msgHandle.database = db; */

  /* Initialize the HTTP server */
  d = dispatcher.NewDispatcher();
  //d.RegisterExpr("^/$", http.HandlerFunc(mainHandle));
  d.RegisterExpr("^/form$", http.HandlerFunc(formHandle));
  d.RegisterExpr("^/write", http.StripPrefix("/", msgHandle));
  d.RegisterExpr("^/res", http.StripPrefix("/res/", http.FileServer(http.Dir("html/res/"))));

  log.Fatal(http.ListenAndServe("127.0.0.1:8085", d))
}
