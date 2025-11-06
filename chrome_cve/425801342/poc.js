let called = false;

const options = {
  get relativeTo() {
    called = true;

  },
  roundingMode: 'halfExpand'
};

function triggerCrash() {
  const duration = Temporal.Duration.from({ hours: 1 });
  duration.add({ hours: 2 }, options); 
}

triggerCrash();

