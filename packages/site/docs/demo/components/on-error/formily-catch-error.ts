export function compiler(expression: string, scope: any = {}) {
  try {
    return new Function('$root', `with($root) { return (${expression}); }`)(
      scope,
    );
  } catch (error) {
    console.group('formily:expr-error');
    console.error(error);
    console.log('expr', expression);
    console.log('scope', scope);
    console.log('address', scope.$self.address.entire);
    console.groupEnd();
  }
}
