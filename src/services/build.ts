import * as files from "../lib/utils/files"

function build(): void {
  files.mkTemp();

  
  files.rmTemp();
}

build();
