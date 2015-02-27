package main;

import "dispatcher"
import "net/http"
import _ "github.com/mattn/go-sqlite3"
import "database/sql"
import "log"
/* import "time" */
import "fmt"
import "bytes"
import "encoding/json"
import "strconv"
import "io"
import "os"
import "encoding/csv"

type ReceiveMessageHandle struct {
  database *sql.DB;
};

func valueToString(in interface{}) string {
            switch t := in.(type) {
            default:
                return "nil";
            case string:
                return t;
            case int:
                return strconv.FormatInt(int64(t), 10);
            case int64:
                return strconv.FormatInt(t, 10);
            case float64:
                return strconv.FormatFloat(t, 'f', 6, 64);
            case bool:
                if t == true {
                    return "true";
                }else{
                    return "false";
                }
            }
}

func decodeData(jsontext string) (out []map[string]string, ok bool){
    var strarr []interface{};
    outmap := make(map[string]string);

    err := json.Unmarshal(bytes.NewBufferString(jsontext).Bytes(), &strarr);
    if err != nil {
		fmt.Println("error:", err)
        return nil, false;
	}

    if(strarr[0] == "magic v0.1") {
        //var record []string;


        for i := 1; i < len(strarr); i++ {
            m, isok := strarr[i].(map[string]interface{});
            if(!isok) {
                // All of these should work
                return nil, false;
            }

            for key, value := range m {
                //fmt.Println(key + ", " + valueToString(value));
                outmap[key] = valueToString(value);
            }
            out = append(out, outmap);
        }

    }

    return out, true;
}

func writeCsvRecords(wr io.Writer, columns []string, records []map[string]string) {
    csvwrite := csv.NewWriter(wr);

    // Loop over the records
    for _, record := range records {
        // Find the keys we're using
        outslice := make([]string, len(columns));
        for i, keyname := range columns {
            col, ok := record[keyname];
            if(ok) {
                outslice[i] = col;
            } else {
                outslice[i] = "nil";
            }
        }
        csvwrite.Write(outslice);
    }

    csvwrite.Flush();
}

func (wh ReceiveMessageHandle) ServeHTTP(wr http.ResponseWriter, req *http.Request) {
  /* message = req.FormValue("message");
  from = req.FormValue("from");
  to = req.FormValue("to");
  timestamp = time.Now(); */

  wr.WriteHeader(200);
  wr.Header().Add("Content-Type", "text/html");

  file, err := os.OpenFile("output.csv", os.O_RDWR | os.O_APPEND, 0660);
  if(err != nil) {
    fmt.Fprintln(wr, "Failed");
    return;
  }
  defer file.Close();

  buf := new(bytes.Buffer);
  buf.ReadFrom(req.Body);
  s := buf.String();
  records, ok := decodeData(s);
  if(ok) {
    writeCsvRecords(file, []string{"timestamp", "f_teamNumber"}, records);
    fmt.Fprintln(wr, "OK");
    return;
  }

  fmt.Fprintln(wr, "Failed");
}

func formHandle(wr http.ResponseWriter, req *http.Request) {
    http.ServeFile(wr, req, "html/scouting-form.html");
}

func csvHandle(wr http.ResponseWriter, req *http.Request) {
    http.ServeFile(wr, req, "output.csv");
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
  msgHandle.database = db;

  /* Initialize the HTTP server */
  d = dispatcher.NewDispatcher();
  //d.RegisterExpr("^/$", http.HandlerFunc(mainHandle));
  d.RegisterExpr("^/form$", http.HandlerFunc(formHandle));
  d.RegisterExpr("^/output.csv$", http.HandlerFunc(csvHandle));
  d.RegisterExpr("^/write", http.StripPrefix("/", msgHandle));
  d.RegisterExpr("^/res", http.StripPrefix("/res/", http.FileServer(http.Dir("html/res/"))));

  log.Fatal(http.ListenAndServe("127.0.0.1:8085", d))
}
