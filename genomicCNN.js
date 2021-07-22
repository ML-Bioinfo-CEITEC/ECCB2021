function prolongSequence(sequence, size) {  
    const Ncount = size - sequence.length;
    const leftNcount = Math.floor(Math.random() * (Ncount+1));
    const rightNcount = Ncount - leftNcount;
    const leftNs = "N".repeat(leftNcount);
    const rightNs = "N".repeat(rightNcount);
    return leftNs.concat(sequence, rightNs);
  }
  
  function validateSequence(sequence, minSize=20, maxSize=200) {
    if (sequence.length > maxSize) {
      return 'The sequence is too long. The sequence needs to be shorter or equal to '.concat(maxSize, '.');
    } else if (sequence.length < minSize) {
      return 'The sequence is too short. The sequence needs to be longer or equal to '.concat(minSize, '.');
    } else if ('' != sequence.replace(/A/g,'').replace(/T/g,'').replace(/C/g,'').replace(/G/g,'').replace(/N/g,'')) {
      return 'The sequence must consist only of "A", "C", "T", "G" and "N" characters.';
    } else {
      return '';
    }
  }
  
  function getAverage(array){
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return mean
  }
  
  // copied from https://stackoverflow.com/a/53577159
  function getStandardDeviation(array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
  }
  
  function formatText(sequence, results, error=0, seq_name='') {
    console.log("formatting output..." + error);
  
    var output = "<br/><b>Input:</b><seqtext>";
    if (seq_name!='') {
      output = output.concat(">", seq_name, "<br/>");
    }
  
    output = output.concat(sequence.replace(/(.{50})/g,"$1<br/>"), "</seqtext>");
    if (error) {
      output = output.concat("<b>Error:</b><br/><br/>", results, '<br/><br/><br/>');
    } else {
  
      result = getAverage(results).toFixed(3);
      stdev = getStandardDeviation(results);
      twoerr = (2 * stdev / Math.sqrt(results.length - 1)).toFixed(3);
      if (twoerr < 0.001) {
        twoerr = '<0.001'
      }
  
      if (result > 0.85) {
        output = output.concat("<b>Output:</b><br/><br/>Probability of G4 complex =   ", result, ' (±', twoerr,')<br/><br/><br/>');
      } else if (result > 0.5) {
        output = output.concat("<b>Output:</b><br/><br/>Probability of G4 complex =   ", result, ' (±', twoerr,')<br/><br/><br/>');
      } else {
        output = output.concat("<b>Output:</b><br/><br/>Probability of G4 complex =   ", result, ' (±', twoerr,')<br/><br/><br/>');
      }  
    }
  
    return output
  }
  
  function formatTable(sequence, results, error=0, seq_name='') {
    console.log("formatting output as CSV..." + error);
  
    var output = "";
    if (seq_name!='') {
      output = output.concat(seq_name, ", ");
    }
  
    output = output.concat(sequence, ", ");
    if (error) {
      output = output.concat("NA, NA");
    } else {
      result = getAverage(results).toFixed(6);
      stdev = getStandardDeviation(results);
      twoerr = (2 * stdev / Math.sqrt(results.length - 1)).toFixed(6);
      output = output.concat(result, ', ', twoerr);
    }
    output = output.concat("<br/>");
  
    return output
  };
  
  function formatOutput(sequence, results, error=0, seq_name='', output_type='text') {
    if (output_type=='text') {
      return formatText(sequence, results, error, seq_name) 
    } else {
      return formatTable(sequence, results, error, seq_name) 
    }
  };
  
  function oneHot(s200) {
    // one-hot encoding
    const t = s200.replace(/A/g,'0').replace(/T/g,'1').replace(/C/g,'2').replace(/G/g,'3').replace(/N/g,'9')
    const y = tf.oneHot(tf.tensor1d(t.split(''),'int32'),4);
    return y.reshape([1,200,4]);
  }
  
  function simpleSeq(x) {
    return {name: '', seq: x};
  }
  
  function setTextArea(text='') {
    var ta = document.getElementById('text1');
    ta.value = '';
    ta.placeholder = text;
  }
  
  function checkedSingle(){
    setTextArea("Copy your DNA sequence here (20 - 200bp sequence consisting of A, C, G, T and N characters).\n\nExample:\nGGAAGACCCAATCGGACCGGGAGGTCCGGGGAGACGTGTCGGGGATCGGG");
  }
  
  function checkedFasta(){
    setTextArea("Copy your FASTA formatted DNA sequences here.\n\nExample:\n>Seq1\nGGAAGACCCAATCGGACCGGGAGGTCCGGGGAGACGTGTCGGGGATCGGG\n>Seq2\nTGTCAGAAACTTATATTGGGTGATTTCATTTTTAAAAGTAACCAAAGTGAAAAAT");
  }
  
  function checkedMultiline(){
    setTextArea("Copy your DNA sequences here (each on a separate line).\n\nExample:\nGGAAGACCCAATCGGACCGGGAGGTCCGGGGAGACGTGTCGGGGATCGGG\nTGTCAGAAACTTATATTGGGTGATTTCATTTTTAAAAGTAACCAAAGTGAAAAAT");
  }
  
  function loadExample(){
    console.log("making example...");
    if(document.getElementById('opt_single').checked) {
      example = "GAGACACCACTACAGTTAGCAGTGAGTGTAAAATAATGAGTGTCAGAAACTTATATTGGGTGATTTCATTTTTAAAAGTAACCAAAGTGAAAAATGAAGCCTTGCGTTTTTGCTTAAATGATTTACAAAAAATATTTGATGTCCATCCTGGGATAGGGAATTCCTCCCCCATAACTTTGAAAGTGCAGTTGCTTCATTCC"
    }
    if(document.getElementById('opt_fasta').checked) {  
      example = ">negative_example\nGAGACACCACTACAGTTAGCAGTGAGTGTAAAATAATGAGTGTCAGAAACTTATATTGGGTGATTTCATTTTTAAAAGTAACCAAAGTGAAAAATGAAGCCTTGCGTTTTTGCTTAAATGATTTACAAAAAATATTTGATGTCCATCCTGGGATAGGGAATTCCTCCCCCATAACTTTGAAAGTGCAGTTGCTTCATTCC\n>positive_example\nGAAGAGACCAAGACGGAAGACCCAATCGGACCGGGAGGTCCGGGGAGACGTGTCGGGGATCGGGACTTGACTGTGCTTACCAAAGGACCTAACGGAGGGGTCCATAGGAGTCTTGCGGGACTCCCTGGCACTGGAGTAGTATCGACATAAGGGTCACGGACGTTCCATTTAGTGAGCCATTTATAAACCACTATC\n>wrong_input\nFFGHAAJ"
    }
    if(document.getElementById('opt_multiline').checked) {  
      example = "GAGACACCACTACAGTTAGCAGTGAGTGTAAAATAATGAGTGTCAGAAACTTATATTGGGTGATTTCATTTTTAAAAGTAACCAAAGTGAAAAATGAAGCCTTGCGTTTTTGCTTAAATGATTTACAAAAAATATTTGATGTCCATCCTGGGATAGGGAATTCCTCCCCCATAACTTTGAAAGTGCAGTTGCTTCATTCC\nGAAGAGACCAAGACGGAAGACCCAATCGGACCGGGAGGTCCGGGGAGACGTGTCGGGGATCGGGACTTGACTGTGCTTACCAAAGGACCTAACGGAGGGGTCCATAGGAGTCTTGCGGGACTCCCTGGCACTGGAGTAGTATCGACATAAGGGTCACGGACGTTCCATTTAGTGAGCCATTTATAAACCACTATC"
    }  
  
    var textarea = document.getElementById('text1');
    textarea.value = example;
  };
  
  async function makePrediction() {
    
    // get HTML elements
    var prob = document.getElementById('print_penguinn');
    prob.innerHTML = '';
    var txt = document.getElementById('text1').value;
    
    console.log("model loading...");
  
    // clear the model variable
    var model = undefined;
    // load model
    model = await tf.loadLayersModel("https://raw.githubusercontent.com/ML-Bioinfo-CEITEC/penguinn/gh-pages/assets/model.json");
    console.log("model loaded...");
  
    // parse input text into the array of sequences
    var seqArray = [];
    if(document.getElementById('opt_single').checked) {
      const seq = txt.replace(/\r?\n|\r/g,'').replace(/\s/g, '');
      seqArray = [simpleSeq(seq)];
    }
    if(document.getElementById('opt_fasta').checked) {
      var fasta = require("biojs-io-fasta");
      seqArray = fasta.parse(txt);
    }  
    if(document.getElementById('opt_multiline').checked) {
      seqArray = txt.split(/\r?\n/).map(simpleSeq);
    }
  
    if(document.getElementById('opt_tabularoutput').checked) {
      var output_type="tabular";
      if(document.getElementById('opt_fasta').checked) {
        prob.innerHTML += '<b>Name, </b>'
      }
      prob.innerHTML += '<b>Sequence, G4_Probability, Twice_SE</b><br />';
    }
    if(document.getElementById('opt_textoutput').checked) {
      var output_type="text";
    }
    
    
    // process the array of sequences
    for (var i = 0; i < seqArray.length; i++) {  
      
      var s = seqArray[i].seq.toUpperCase();
      
      // check the sequence format
      const validation = validateSequence(s, 20, 200)
      if (validation != '') {
        console.log("wrong input...");
        prob.innerHTML += formatOutput(s, validation, 1, seqArray[i].name, output_type);
        continue;
      }
      var s2 = s;
  
      const Ntries = 100; // number of tries 
      var results = [];
      for (j=0; j<Ntries; j++) {
        if (s.length < 200) {
          s2 = prolongSequence(s, 200);
        }  
    
        // from string to one-hot array
        var a = oneHot(s2);
    
        // inference
        results.push(parseFloat(model.predict(a).asScalar().dataSync()));
      }
  
      // output
      prob.innerHTML += formatOutput(s, results, 0, seqArray[i].name, output_type);
    }  
    
  }
  
  // Example(s): 
  // GAGACACCACTACAGTTAGCAGTGAGTGTAAAATAATGAGTGTCAGAAACTTATATTGGGTGATTTCATTTTTAAAAGTAACCAAAGTGAAAAATGAAGCCTTGCGTTTTTGCTTAAATGATTTACAAAAAATATTTGATGTCCATCCTGGGATAGGGAATTCCTCCCCCATAACTTTGAAAGTGCAGTTGCTTCATTCC
  // 0.00069759286
  // NNNGAAGAGACCAAGACGGAAGACCCAATCGGACCGGGAGGTCCGGGGAGACGTGTCGGGGATCGGGACTTGACTGTGCTTACCAAAGGACCTAACGGAGGGGTCCATAGGAGTCTTGCGGGACTCCCTGGCACTGGAGTAGTATCGACATAAGGGTCACGGACGTTCCATTTAGTGAGCCATTTATAAACCACTATCNN
  // 0.87126887
