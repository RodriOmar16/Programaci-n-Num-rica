import java.util.Scanner;

public class funcionEmpirica {
	public double listPtos[][];
	public double listaLinealizada[][];
	public int cant;
	public double a, b;
	public String familia = "";
	
	public funcionEmpirica(int n){
		this.listPtos 			= new double[n][2];
		this.listaLinealizada	= new double[n][2];
		this.cant 	  			= n;
	}
	
	//GETTER AND SETTERS
	public double[][] getListaPtos(){
		return this.listPtos;
	}
	public void setListaPtos(double l[][], int n) {
		setCantidad(n);
		for(int i=0; i<n ;i++) {
			for(int j=0; j<2 ;j++) {
				this.listPtos[i][j] = l[i][j];
			}
		}
	}
	
	public int getCantidad() {
		return this.cant;
	}
	public void setCantidad(int n) {
		this.cant = n;
	}
	
	public double getA() {
		return this.a;
	}
	public void setA(double a1) {
		this.a = a1;
	}
	
	public double getB() {
		return this.b;
	}
	public void setB(double b1) {
		this.b = b1;
	}
	
	//MéTODOS
	public void cargarListaPtos() {
		int n = getCantidad();
		Scanner teclado = new Scanner(System.in);
		
		for(int i=0; i<n ;i++) {
			for(int j=0; j<2 ;j++) {
				if(j==0) {
					System.out.print("Ingresar coordenada de x: ");
				}else System.out.print("Ingresar coordenada de y = f(x): ");
				this.listPtos[i][j] = teclado.nextDouble();
			}
		}
		teclado.close();
	}
	public boolean controlarPtos() {
		int n = getCantidad();
		
		int i=0, j;
		 boolean cumple = true;
		  while(i<n && cumple) {
			j=0;
			while(j<2 && this.listPtos[i][j] > 0) {
				j++;
			}
			if(j<2){
				cumple = false;
			}
			i++;
		}
		if(!cumple) {
			System.out.println("Existe un pto que tiene coordenada negativo o cero.\nNo es posible continuar. Realice una traslación.");
			return false;
		}else return true;
	}
	public void mostrarListaPtos() {
		int n = getCantidad();
		
		System.out.println("\nMuestra de la lista de ptos.:");
		System.out.println(" x | f(x) ");
		for(int i=0; i<n ;i++) {
			//System.out.println("");
			for(int j=0; j<2 ;j++) {
				if(j == 0) {
					System.out.print(this.listPtos[i][j]+" | ");
				}else System.out.println(this.listPtos[i][j]);
			}
		}
	}
	
	//LINEALIZACION
	public void linealizacion(String flia) {
		int n = getCantidad();
		
		if(flia.equals("Potencial")) {
			for(int i=0; i<n ;i++) {
				for(int j=0; j<2 ;j++) {
					this.listaLinealizada[i][j] = Math.log10(this.listPtos[i][j]);
				}
			}
		}else {
			if(flia.equals("Exponencial")) {
				for(int i=0; i<n ;i++) {
					this.listaLinealizada[i][0] = this.listPtos[i][0];
					this.listaLinealizada[i][1] = Math.log(this.listPtos[i][1]);
				}
			}else {
				if(flia.equals("Lineal")) {
					for(int i=0; i<n ;i++) {
						for(int j=0; j<2 ;j++) {
							this.listaLinealizada[i][j] = this.listPtos[i][j];
						}
					}
				}else {
					//racional
					for(int i=0; i<n ;i++) {
						this.listaLinealizada[i][0] = this.listPtos[i][0];
						this.listaLinealizada[i][1] = 1/(this.listPtos[i][1]);
					}
				}
			}
		}
		System.out.println("\nMuestra de la lista de ptos.:");
		System.out.println(" x | f(x) ");
		for(int i=0; i<n ;i++) {
			//System.out.println("");
			for(int j=0; j<2 ;j++) {
				if(j == 0) {
					System.out.print(this.listaLinealizada[i][j]+" | ");
				}else System.out.println(this.listaLinealizada[i][j]);
			}
		}
	}
	//PUNTOS SELECCIONADOS
	public void puntosSeleccionados(int ind1, int ind2) {
		double m[][] = new double[2][3];
		
		//ARMO EL SISTEMA
		m[0][0] = this.listaLinealizada[ind1][0];		m[0][1] = 1;		m[0][2] = this.listaLinealizada[ind1][1];
		m[1][0] = this.listaLinealizada[ind2][0];		m[1][1] = 1;		m[1][2] = this.listaLinealizada[ind2][1];
		
		System.out.println("\nMuestra del sistema: ");
		for(int i=0; i<2 ;i++) {
			System.out.println("");
			for(int j=0; j<3 ;j++) {
				if(j!=1){
					System.out.print(m[i][j]+"\t");
				}else System.out.print(m[i][j]+" | ");
			}
		}
		
		b = (m[0][0] * m[1][2] - m[1][0] * m[0][2])/(m[0][0] - m[1][0]);
		
		a = (m[0][2]-b)/m[0][0];
	}
}
